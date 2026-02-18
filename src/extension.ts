import * as vscode from "vscode";
import { registerDependencyAlerts } from "./features/dependency-alerts/index.js";
import { registerDependencyLinksProvider } from "./features/dependency-links/provider.js";

export function activate(context: vscode.ExtensionContext) {
  const dependencyLinksProvider = registerDependencyLinksProvider();
  const dependencyAlerts = registerDependencyAlerts();

  context.subscriptions.push(dependencyLinksProvider, dependencyAlerts);
}

export function deactivate() {}
