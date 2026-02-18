import * as vscode from "vscode";
import { registerDependencyAlerts } from "./features/dependency-alerts/index.js";
import { registerDependencyLinks } from "./features/dependency-links/index.js";
import { registerMigrationAlerts } from "./features/migration-alerts/index.js";
import { SharedAlertsStatusBar } from "./features/shared/alertsStatusBar.js";

export function activate(context: vscode.ExtensionContext) {
  const dependencyLinksProvider = registerDependencyLinks();
  const alertsStatusBar = new SharedAlertsStatusBar();
  const dependencyAlerts = registerDependencyAlerts(context, alertsStatusBar);
  const migrationAlerts = registerMigrationAlerts(alertsStatusBar);

  context.subscriptions.push(
    dependencyLinksProvider,
    alertsStatusBar,
    dependencyAlerts,
    migrationAlerts,
  );
}

export function deactivate() {}
