import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const clip = (text, limit = 240) => {
  const line = text.replace(/[\x00-\x1f\x7f]/g, " ").trim();
  return line.length > limit ? `${line.slice(0, limit)}…` : line;
};

function pendingTask(markdown) {
  let fence;
  for (const line of markdown.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined;
      continue;
    }
    if (fence) continue;
    const task = line.match(/^\s*(?:[-*+]|\d+[.)])\s+\[ \]\s+(.+)/);
    if (task) return clip(task[1]);
  }
  return "sin tareas pendientes";
}

try {
  const git = (...args) => execFileSync("git", ["--no-optional-locks", ...args], {
    cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 8 * 1024 * 1024,
  });
  const root = git("rev-parse", "--show-toplevel").trim();
  process.chdir(root);
  const optional = (args, fallback) => { try { return git(...args).trim(); } catch { return fallback; } };
  console.log(`Rama: ${clip(optional(["symbolic-ref", "--quiet", "--short", "HEAD"], "HEAD separado"))}`);
  console.log(`Último commit: ${clip(optional(["log", "-1", "--format=%h %s"], "sin commits"))}`);

  // NUL-delimited porcelain preserves spaces, newlines and rename source paths.
  const records = git("status", "--porcelain=v1", "-z", "--untracked-files=all").split("\0").filter(Boolean);
  const files = [];
  let untracked = 0;
  for (let i = 0; i < records.length; i++) {
    const status = records[i].slice(0, 2);
    const path = records[i].slice(3);
    const source = /[RC]/.test(status) ? records[++i] : undefined;
    if (status === "??") untracked++;
    files.push(`${status} ${JSON.stringify(path)}${source ? ` <- ${JSON.stringify(source)}` : ""}`);
  }
  console.log(`Git: ${files.length ? `${files.length} archivo(s) con cambios` : "limpio"}`);
  if (files.length) {
    console.log("Archivos (XY: índice / directorio de trabajo; ??: sin registrar):");
    for (const file of files.slice(0, 20)) console.log(`  ${file.slice(0, 2)} ${clip(file.slice(3), 300)}`);
    if (files.length > 20) console.log(`  … ${files.length - 20} más`);
    console.log(`Resumen preparado: ${git("diff", "--cached", "--shortstat").trim() || "sin cambios"}`);
    console.log(`Resumen sin preparar: ${git("diff", "--shortstat").trim() || "sin cambios"}`);
    console.log(`Sin registrar: ${untracked} (no incluidos en las estadísticas del diff)`);
  } else console.log("Resumen: sin cambios");

  const directory = "docs/exec-plans/active";
  let plans;
  try {
    plans = readdirSync(join(root, directory), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => entry.name).sort();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    plans = [];
  }
  if (!plans.length) console.log("Plan activo: ninguno; crear un plan antes de implementar.");
  if (plans.length > 1) console.log(`Varios planes activos (${plans.length}); seleccionar explícitamente el pertinente.`);
  for (const plan of plans.slice(0, 5)) {
    console.log(`Plan activo: ${directory}/${clip(plan)}`);
    console.log(`Primera pendiente: ${pendingTask(readFileSync(join(root, directory, plan), "utf8"))}`);
  }
  if (plans.length > 5) console.log(`… ${plans.length - 5} planes más en ${directory}`);
} catch (error) {
  console.error(`agent:context: ${clip(error.message)}`);
  process.exitCode = 1;
}
