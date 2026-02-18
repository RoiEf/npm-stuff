import * as vscode from "vscode";
import { getDependencyAlertsConfig } from "./config.js";

export function registerDependencyAlerts(): vscode.Disposable {
  const config = getDependencyAlertsConfig();

  return {
    dispose() {
      void config.enabled;
      void config.alwaysShowEnabled;
    },
  };
}