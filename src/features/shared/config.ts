import * as vscode from "vscode";

export interface SharedAlertsConfig {
  alwaysShowAlertsEnabled: boolean;
}

export function getSharedAlertsConfig(): SharedAlertsConfig {
  const config = vscode.workspace.getConfiguration("npm-stuff");

  return {
    alwaysShowAlertsEnabled: config.get<boolean>(
      "alwaysShowAlerts.enabled",
      true,
    ),
  };
}
