import * as path from "node:path";
import * as vscode from "vscode";

const BASELINE_STORAGE_PREFIX =
  "npm-stuff.dependenciesAlerts.installedBaseline:";

type JsonObject = Record<string, unknown>;

interface PackageDependencySections {
  dependencies: JsonObject;
  devDependencies: JsonObject;
  overrides: JsonObject;
}

export interface DesiredDependencyState {
  signature?: string;
  hasDependencyEntries: boolean;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortJson(item));
  }

  if (!isJsonObject(value)) {
    return value;
  }

  const sortedKeys = Object.keys(value).sort();
  const sorted: JsonObject = {};

  for (const key of sortedKeys) {
    sorted[key] = sortJson(value[key]);
  }

  return sorted;
}

function toRecord(value: unknown): JsonObject {
  return isJsonObject(value) ? value : {};
}

function hasTopLevelKeys(value: JsonObject): boolean {
  return Object.keys(value).length > 0;
}

function baselineStorageKey(workspaceFolder: vscode.WorkspaceFolder): string {
  return `${BASELINE_STORAGE_PREFIX}${workspaceFolder.uri.toString()}`;
}

async function fileExists(fileUri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(fileUri);
    return true;
  } catch {
    return false;
  }
}

export function getPrimaryWorkspaceFolder():
  | vscode.WorkspaceFolder
  | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined;
  }

  return workspaceFolders[0];
}

export function getPackageJsonUri(
  workspaceFolder: vscode.WorkspaceFolder,
): vscode.Uri {
  return vscode.Uri.joinPath(workspaceFolder.uri, "package.json");
}

export function getPackageLockJsonUri(
  workspaceFolder: vscode.WorkspaceFolder,
): vscode.Uri {
  return vscode.Uri.joinPath(workspaceFolder.uri, "package-lock.json");
}

export function getInstallMarkerUri(
  workspaceFolder: vscode.WorkspaceFolder,
): vscode.Uri {
  return vscode.Uri.file(
    path.join(workspaceFolder.uri.fsPath, "node_modules", ".package-lock.json"),
  );
}

export async function hasInstallMarker(
  workspaceFolder: vscode.WorkspaceFolder,
): Promise<boolean> {
  return fileExists(getInstallMarkerUri(workspaceFolder));
}

export async function readDesiredDependencyState(
  workspaceFolder: vscode.WorkspaceFolder,
): Promise<DesiredDependencyState> {
  const packageJsonUri = getPackageJsonUri(workspaceFolder);

  try {
    const contentBytes = await vscode.workspace.fs.readFile(packageJsonUri);
    const packageJsonText = Buffer.from(contentBytes).toString("utf8");
    const packageJsonRaw = JSON.parse(packageJsonText) as unknown;

    if (!isJsonObject(packageJsonRaw)) {
      return { hasDependencyEntries: false };
    }

    const normalizedSections: PackageDependencySections = {
      dependencies: toRecord(packageJsonRaw.dependencies),
      devDependencies: toRecord(packageJsonRaw.devDependencies),
      overrides: toRecord(packageJsonRaw.overrides),
    };

    const hasDependencyEntries =
      hasTopLevelKeys(normalizedSections.dependencies) ||
      hasTopLevelKeys(normalizedSections.devDependencies) ||
      hasTopLevelKeys(normalizedSections.overrides);

    return {
      signature: JSON.stringify(sortJson(normalizedSections)),
      hasDependencyEntries,
    };
  } catch {
    return { hasDependencyEntries: false };
  }
}

export function getStoredBaselineSignature(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder,
): string | undefined {
  return context.workspaceState.get<string>(
    baselineStorageKey(workspaceFolder),
  );
}

export async function setStoredBaselineSignature(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder,
  signature: string,
): Promise<void> {
  await context.workspaceState.update(
    baselineStorageKey(workspaceFolder),
    signature,
  );
}
