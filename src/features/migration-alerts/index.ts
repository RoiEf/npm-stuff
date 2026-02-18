import * as vscode from "vscode";
import { getMigrationAlertsConfig } from "./config.js";
import { getPrimaryWorkspaceFolder } from "../dependency-alerts/state.js";
import { type SharedAlertsStatusBar } from "../shared/alertsStatusBar.js";
import { getSharedAlertsConfig } from "../shared/config.js";

const MIGRATION_ALERT_KEY = "migration-alerts";

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRecord(value: unknown): JsonObject {
  return isJsonObject(value) ? value : {};
}

async function hasPrismaDependency(
  workspaceFolder: vscode.WorkspaceFolder,
): Promise<boolean> {
  try {
    const packageJsonUri = vscode.Uri.joinPath(
      workspaceFolder.uri,
      "package.json",
    );
    const contentBytes = await vscode.workspace.fs.readFile(packageJsonUri);
    const packageJsonText = Buffer.from(contentBytes).toString("utf8");
    const packageJsonRaw = JSON.parse(packageJsonText) as unknown;

    if (!isJsonObject(packageJsonRaw)) {
      return false;
    }

    const dependencies = toRecord(packageJsonRaw.dependencies);
    const devDependencies = toRecord(packageJsonRaw.devDependencies);

    return "prisma" in dependencies || "prisma" in devDependencies;
  } catch {
    return false;
  }
}

export function registerMigrationAlerts(
  statusBar: SharedAlertsStatusBar,
): vscode.Disposable {
  const disposables: vscode.Disposable[] = [];
  const workspaceFolder = getPrimaryWorkspaceFolder();
  let evaluateTimeout: NodeJS.Timeout | undefined;

  const runEvaluation = async (): Promise<void> => {
    const migrationConfig = getMigrationAlertsConfig();
    const sharedConfig = getSharedAlertsConfig();

    if (!migrationConfig.enabled) {
      statusBar.clearAlert(MIGRATION_ALERT_KEY);
      return;
    }

    if (!workspaceFolder) {
      statusBar.setAlert(MIGRATION_ALERT_KEY, {
        text: "$(warning) migration alerts unavailable",
        tooltip:
          "npm-stuff: Migration alerts are enabled but no workspace folder is open. Feature disabled.",
        severity: "warning",
        priority: 95,
      });
      return;
    }

    const prismaDependencyExists = await hasPrismaDependency(workspaceFolder);

    if (!prismaDependencyExists) {
      statusBar.setAlert(MIGRATION_ALERT_KEY, {
        text: "$(warning) Prisma dependency missing",
        tooltip:
          "npm-stuff: Migration alerts disabled because prisma was not found in dependencies or devDependencies.",
        severity: "warning",
        priority: 95,
      });
      return;
    }

    if (sharedConfig.alwaysShowAlertsEnabled) {
      statusBar.setAlert(MIGRATION_ALERT_KEY, {
        text: "$(check) migrations monitored",
        tooltip:
          "npm-stuff: Migration alerts are enabled. Prisma status checks will determine migration state.",
        severity: "success",
        priority: 5,
      });
      return;
    }

    statusBar.clearAlert(MIGRATION_ALERT_KEY);
  };

  const scheduleEvaluation = (): void => {
    if (evaluateTimeout) {
      clearTimeout(evaluateTimeout);
    }

    evaluateTimeout = setTimeout(() => {
      void runEvaluation();
    }, 200);
  };

  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (
        event.affectsConfiguration("npm-stuff.migrationAlerts") ||
        event.affectsConfiguration("npm-stuff.alwaysShowAlerts.enabled")
      ) {
        scheduleEvaluation();
      }
    },
  );

  const packageJsonWatcher = workspaceFolder
    ? vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(workspaceFolder, "package.json"),
      )
    : undefined;

  packageJsonWatcher?.onDidCreate(() => scheduleEvaluation());
  packageJsonWatcher?.onDidChange(() => scheduleEvaluation());
  packageJsonWatcher?.onDidDelete(() => scheduleEvaluation());

  void runEvaluation();

  disposables.push(configChangeDisposable);

  if (packageJsonWatcher) {
    disposables.push(packageJsonWatcher);
  }

  disposables.push({
    dispose() {
      if (evaluateTimeout) {
        clearTimeout(evaluateTimeout);
      }
      statusBar.clearAlert(MIGRATION_ALERT_KEY);
    },
  });

  return vscode.Disposable.from(...disposables);
}
