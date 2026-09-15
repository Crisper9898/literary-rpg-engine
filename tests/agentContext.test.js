import { afterEach, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const script = resolve("scripts/agent-context.mjs");
const directories = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "journey-context-"));
  directories.push(root);
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git("init", "-b", "context-test");
  writeFileSync(join(root, "tracked.txt"), "original\n");
  mkdirSync(join(root, "docs/exec-plans/active"), { recursive: true });
  writeFileSync(join(root, "docs/exec-plans/active/001-example.md"),
    "# Example\n```md\n- [ ] Ignore this example\n```\n- [x] Completed\n- [ ] Implement the next task\n");
  git("add", ".");
  git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-m", "Fixture checkpoint");
  return { root, git, run: () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" }) };
}
afterEach(() => { for (const root of directories.splice(0)) rmSync(root, { recursive: true, force: true }); });

it("reports the real branch, commit and first pending task without reading code fences as tasks", () => {
  const { root, run } = fixture();
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("context-test");
  expect(result.stdout).toContain("Fixture checkpoint");
  expect(result.stdout).toContain("limpio");
  expect(result.stdout).toContain("docs/exec-plans/active/001-example.md");
  expect(result.stdout).toContain("Implement the next task");
  expect(result.stdout).not.toContain("Ignore this example");
  writeFileSync(join(root, "tracked.txt"), "modified\n");
  expect(run().stdout).toContain('   M "tracked.txt"');
});

it("includes staged, unstaged, renamed and new files while limiting output and hiding diff bodies", () => {
  const { root, git, run } = fixture();
  git("mv", "tracked.txt", "renamed name.txt");
  writeFileSync(join(root, "renamed name.txt"), "original\nDO_NOT_PRINT_DIFF_BODY\n");
  for (let i = 0; i < 30; i++) writeFileSync(join(root, `z-new-${i}.txt`), "untracked\n");
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("renamed name.txt");
  expect(result.stdout).toContain("tracked.txt");
  expect(result.stdout).toContain("z-new-0.txt");
  expect(result.stdout).toContain("31 archivo(s)");
  expect(result.stdout).toContain("11 más");
  expect(result.stdout).toContain("Sin registrar: 30");
  expect(result.stdout).not.toContain("DO_NOT_PRINT_DIFF_BODY");
  expect(result.stdout).not.toContain("diff --git");
  expect(result.stdout.split("\n").length).toBeLessThan(40);
});

it("reports a detached checkout and a missing plan explicitly", () => {
  const { root, git, run } = fixture();
  git("checkout", "--detach");
  rmSync(join(root, "docs/exec-plans/active"), { recursive: true });
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("HEAD separado");
  expect(result.stdout).toContain("Plan activo: ninguno");
});

it("reports every active plan without silently choosing among several", () => {
  const { root, run } = fixture();
  writeFileSync(join(root, "docs/exec-plans/active/002-other.md"), "# Other\n- [x] All done\n");
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Varios planes activos (2)");
  expect(result.stdout).toContain("002-other.md");
  expect(result.stdout).toContain("sin tareas pendientes");
});
