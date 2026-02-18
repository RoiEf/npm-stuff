import * as vscode from "vscode";

export interface DependencyLinksConfig {
  enabled: boolean;
  registryUrl: string;
}

const DEFAULT_REGISTRY_URL = "https://www.npmjs.com/package/";

export function getDependencyLinksConfig(): DependencyLinksConfig {
  const config = vscode.workspace.getConfiguration("npm-stuff");

  return {
    enabled: config.get<boolean>("dependenciesLinks.enabled", true),
    registryUrl: config.get<string>(
      "dependenciesLinks.registryUrl",
      DEFAULT_REGISTRY_URL,
    ),
  };
}