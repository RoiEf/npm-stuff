import * as assert from "assert";
import type * as vscode from "vscode";
import { collectDependencyNameMatches } from "../features/dependency-links/parser.js";

function makeDocument(content: string): vscode.TextDocument {
  const lines = content.split("\n");
  return {
    lineCount: lines.length,
    lineAt: (index: number) =>
      ({
        text: lines[index],
      }) as vscode.TextLine,
  } as vscode.TextDocument;
}

suite("collectDependencyNameMatches", () => {
  test("parses all top-level overrides entries", () => {
    const doc = makeDocument(`{
  "overrides": {
    "magic-string": "^0.30.21",
    "glob": "^13.0.1"
  }
}`);
    const names = collectDependencyNameMatches(doc).map((m) => m.packageName);
    assert.deepStrictEqual(names, ["magic-string", "glob"]);
  });

  test("parses nested entries in the first override group", () => {
    const doc = makeDocument(`{
  "overrides": {
    "@ts-morph/common": {
      "minimatch": "^10.2.1"
    }
  }
}`);
    const names = collectDependencyNameMatches(doc).map((m) => m.packageName);
    assert.deepStrictEqual(names, ["@ts-morph/common", "minimatch"]);
  });

  test("parses all entries when multiple nested override groups are present", () => {
    // Regression test: @eslint/config-array and its nested minimatch were
    // not being collected because the shouldCheckForPeerDependencies flag was
    // reset to false by the minimatch line inside the first nested group,
    // causing the closing } of the first group to terminate overrides parsing.
    const doc = makeDocument(`{
  "overrides": {
    "magic-string": "^0.30.21",
    "glob": "^13.0.1",
    "lodash": "^4.17.23",
    "ajv": "^8.18.0",
    "@ts-morph/common": {
      "minimatch": "^10.2.1"
    },
    "@eslint/config-array": {
      "minimatch": "^10.2.1"
    }
  }
}`);
    const names = collectDependencyNameMatches(doc).map((m) => m.packageName);
    assert.deepStrictEqual(names, [
      "magic-string",
      "glob",
      "lodash",
      "ajv",
      "@ts-morph/common",
      "minimatch",
      "@eslint/config-array",
      "minimatch",
    ]);
  });

  test("parses regular dependencies unaffected", () => {
    const doc = makeDocument(`{
  "dependencies": {
    "lodash": "^4.17.23",
    "rxjs": "^7.8.2"
  }
}`);
    const names = collectDependencyNameMatches(doc).map((m) => m.packageName);
    assert.deepStrictEqual(names, ["lodash", "rxjs"]);
  });
});
