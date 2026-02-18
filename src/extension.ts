import * as vscode from "vscode";
import { registerDependencyAlerts } from "./features/dependency-alerts/index.js";
import { registerDependencyLinks } from "./features/dependency-links/index.js";

export function activate(context: vscode.ExtensionContext) {
  const dependencyLinksProvider = registerDependencyLinks();
  const dependencyAlerts = registerDependencyAlerts(context);

  context.subscriptions.push(dependencyLinksProvider, dependencyAlerts);
}

export function deactivate() {}
