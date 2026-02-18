import * as vscode from "vscode";
import { type DependencyAlertsConfig } from "./config.js";
import { type DependencyAlertEvaluation } from "./types.js";

const RUN_INSTALL_COMMAND = "npm-stuff.dependenciesAlerts.runInstall";

export function createDependencyAlertsStatusBar(): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    30,
  );

  statusBarItem.command = RUN_INSTALL_COMMAND;
  statusBarItem.name = "npm-stuff dependencies alert";

  return statusBarItem;
}

export function renderDependencyAlertsStatus(
  statusBarItem: vscode.StatusBarItem,
  config: DependencyAlertsConfig,
  evaluation: DependencyAlertEvaluation,
): void {
  if (!config.enabled) {
    statusBarItem.hide();
    return;
  }

  const shouldShowOutOfSync = evaluation.status === "outOfSync";
  const shouldShowSynced =
    config.alwaysShowEnabled &&
    (evaluation.status === "synced" || evaluation.status === "unknown");

  if (!shouldShowOutOfSync && !shouldShowSynced) {
    statusBarItem.hide();
    return;
  }

  if (evaluation.status === "outOfSync") {
    statusBarItem.text = "$(warning) npm install required";
    statusBarItem.tooltip = `npm-stuff: ${evaluation.reason}`;
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground",
    );
    statusBarItem.show();
    return;
  }

  if (evaluation.status === "unknown") {
    statusBarItem.text = "$(question) deps status unknown";
    statusBarItem.tooltip = `npm-stuff: ${evaluation.reason}`;
    statusBarItem.backgroundColor = undefined;
    statusBarItem.show();
    return;
  }

  statusBarItem.text = "$(check) deps synced";
  statusBarItem.tooltip = `npm-stuff: ${evaluation.reason}`;
  statusBarItem.backgroundColor = undefined;
  statusBarItem.show();
}
