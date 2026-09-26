import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

const engine = resolve("src/engine");

function* sourceFiles(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) yield* sourceFiles(path);
    else if (item.name.endsWith(".ts")) yield path;
  }
}

describe("engine dependency boundary", () => {
  it("keeps every relative engine import inside the reusable engine", () => {
    for (const file of sourceFiles(engine)) {
      const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
      const visit = (node) => {
        let specifier;
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)) specifier = node.moduleSpecifier.text;
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) specifier = node.arguments[0].text;
        if (specifier?.startsWith(".")) {
          const destination = resolve(dirname(file), specifier);
          expect(destination.startsWith(engine + sep),
            `${relative(process.cwd(), file)} imports ${specifier} outside src/engine`).toBe(true);
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  });
});
