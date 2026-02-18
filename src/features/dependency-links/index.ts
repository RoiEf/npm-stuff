import * as vscode from "vscode";
import { registerDependencyLinksProvider } from "./provider.js";

export function registerDependencyLinks(): vscode.Disposable {
  return registerDependencyLinksProvider();
}