import * as vscode from "vscode";

export interface MigrationAlertsConfig {
  enabled: boolean;
}

export function getMigrationAlertsConfig(): MigrationAlertsConfig {
  const config = vscode.workspace.getConfiguration("npm-stuff");
  return {
    enabled: config.get<boolean>("migrationAlerts.enabled", false),
  };
}
