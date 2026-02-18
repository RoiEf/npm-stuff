import * as vscode from "vscode";
import { getDependencyLinksConfig } from "./config.js";
import { buildDependencyLink } from "./linkBuilder.js";
import { collectDependencyNameMatches } from "./parser.js";

export function registerDependencyLinksProvider(): vscode.Disposable {
  return vscode.languages.registerDocumentLinkProvider(
    { language: "json", pattern: "**/package.json" },
    {
      provideDocumentLinks(document) {
        const config = getDependencyLinksConfig();

        if (!config.enabled) {
          return;
        }

        return collectDependencyNameMatches(document).map((match) =>
          buildDependencyLink(
            match.line,
            match.lineIndex,
            match.packageName,
            config.registryUrl,
          ),
        );
      },
    },
  );
}