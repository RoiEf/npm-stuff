import * as vscode from "vscode";

export interface DependencyAlertsConfig {
  enabled: boolean;
}

export function getDependencyAlertsConfig(): DependencyAlertsConfig {
  const config = vscode.workspace.getConfiguration("npm-stuff");

  return {
    enabled: config.get<boolean>("dependenciesAlerts.enabled", true),
  };
}
