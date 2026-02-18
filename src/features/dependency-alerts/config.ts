import * as vscode from "vscode";

export interface DependencyAlertsConfig {
  enabled: boolean;
  alwaysShowEnabled: boolean;
}

export function getDependencyAlertsConfig(): DependencyAlertsConfig {
  const config = vscode.workspace.getConfiguration("npm-stuff");

  return {
    enabled: config.get<boolean>("dependenciesAlerts.enabled", true),
    alwaysShowEnabled: config.get<boolean>(
      "dependenciesAlerts.alwaysShow.enable",
      true,
    ),
  };
}