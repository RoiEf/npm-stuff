import * as vscode from "vscode";
import { getDependencyAlertsConfig } from "./config.js";
import { evaluateDependencyAlert } from "./detector.js";
import {
  getPrimaryWorkspaceFolder,
  getStoredBaselineSignature,
  hasInstallMarker,
  readDesiredDependencyState,
  setStoredBaselineSignature,
} from "./state.js";
import { renderDependencyAlertsStatus } from "./statusBar.js";
import { type DependencyAlertTrigger } from "./types.js";
import { type SharedAlertsStatusBar } from "../shared/alertsStatusBar.js";
import { getSharedAlertsConfig } from "../shared/config.js";

const RUN_INSTALL_COMMAND = "npm-stuff.dependenciesAlerts.runInstall";
const REFRESH_COMMAND = "npm-stuff.dependenciesAlerts.refresh";

interface GitRepositoryState {
  onDidChange(listener: () => void): vscode.Disposable;
}

interface GitRepository {
  readonly state: GitRepositoryState;
}

interface GitApi {
  readonly repositories: GitRepository[];
}

interface GitExtensionExports {
  getAPI(version: number): GitApi;
}

export function registerDependencyAlerts(
  context: vscode.ExtensionContext,
  statusBar: SharedAlertsStatusBar,
): vscode.Disposable {
  const disposables: vscode.Disposable[] = [];
  const workspaceFolder = getPrimaryWorkspaceFolder();
  let evaluateTimeout: NodeJS.Timeout | undefined;

  if (!workspaceFolder) {
    const dependencyConfig = getDependencyAlertsConfig();
    const sharedConfig = getSharedAlertsConfig();

    renderDependencyAlertsStatus(statusBar, dependencyConfig, sharedConfig, {
      status: "unknown",
      reason: "Open a workspace folder to enable project dependency alerts.",
    });

    return vscode.Disposable.from(...disposables);
  }

  const runEvaluation = async (
    trigger: DependencyAlertTrigger,
  ): Promise<void> => {
    const dependencyConfig = getDependencyAlertsConfig();
    const sharedConfig = getSharedAlertsConfig();

    if (!dependencyConfig.enabled) {
      renderDependencyAlertsStatus(statusBar, dependencyConfig, sharedConfig, {
        status: "unknown",
        reason: "Dependency alerts are disabled in settings.",
      });
      return;
    }

    const desiredState = await readDesiredDependencyState(workspaceFolder);
    const baselineSignature = getStoredBaselineSignature(
      context,
      workspaceFolder,
    );
    const installMarkerExists = await hasInstallMarker(workspaceFolder);
    const evaluation = evaluateDependencyAlert({
      desiredSignature: desiredState.signature,
      hasDependencyEntries: desiredState.hasDependencyEntries,
      baselineSignature,
      hasInstallMarker: installMarkerExists,
      trigger,
    });

    if (
      evaluation.baselineSignature &&
      evaluation.baselineSignature !== baselineSignature
    ) {
      await setStoredBaselineSignature(
        context,
        workspaceFolder,
        evaluation.baselineSignature,
      );
    }

    renderDependencyAlertsStatus(
      statusBar,
      dependencyConfig,
      sharedConfig,
      evaluation,
    );
  };

  const scheduleEvaluation = (trigger: DependencyAlertTrigger): void => {
    if (evaluateTimeout) {
      clearTimeout(evaluateTimeout);
    }

    evaluateTimeout = setTimeout(() => {
      void runEvaluation(trigger);
    }, 350);
  };

  const runInstallCommand = vscode.commands.registerCommand(
    RUN_INSTALL_COMMAND,
    () => {
      const terminal = vscode.window.createTerminal({
        name: "npm-stuff install",
        cwd: workspaceFolder.uri.fsPath,
      });

      terminal.show();
      terminal.sendText("npm install");
    },
  );

  const refreshCommand = vscode.commands.registerCommand(
    REFRESH_COMMAND,
    () => {
      scheduleEvaluation("manual-refresh");
    },
  );

  const packageJsonWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceFolder, "package.json"),
  );
  const packageLockWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceFolder, "package-lock.json"),
  );
  const installMarkerWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(
      workspaceFolder,
      "node_modules/.package-lock.json",
    ),
  );

  packageJsonWatcher.onDidChange(() => scheduleEvaluation("package-json"));
  packageJsonWatcher.onDidCreate(() => scheduleEvaluation("package-json"));
  packageJsonWatcher.onDidDelete(() => scheduleEvaluation("package-json"));

  packageLockWatcher.onDidChange(() => scheduleEvaluation("package-lock"));
  packageLockWatcher.onDidCreate(() => scheduleEvaluation("package-lock"));
  packageLockWatcher.onDidDelete(() => scheduleEvaluation("package-lock"));

  installMarkerWatcher.onDidChange(() => scheduleEvaluation("install-marker"));
  installMarkerWatcher.onDidCreate(() => scheduleEvaluation("install-marker"));
  installMarkerWatcher.onDidDelete(() => scheduleEvaluation("package-lock"));

  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (
        event.affectsConfiguration("npm-stuff.dependenciesAlerts") ||
        event.affectsConfiguration("npm-stuff.alwaysShowAlerts.enabled")
      ) {
        scheduleEvaluation("config-change");
      }
    },
  );

  const gitExtension =
    vscode.extensions.getExtension<GitExtensionExports>("vscode.git");
  const gitApi = gitExtension?.exports?.getAPI(1);

  if (gitApi) {
    for (const repository of gitApi.repositories) {
      disposables.push(
        repository.state.onDidChange(() => {
          scheduleEvaluation("git");
        }),
      );
    }
  }

  void runEvaluation("startup");

  disposables.push(
    runInstallCommand,
    refreshCommand,
    packageJsonWatcher,
    packageLockWatcher,
    installMarkerWatcher,
    configChangeDisposable,
    {
      dispose() {
        if (evaluateTimeout) {
          clearTimeout(evaluateTimeout);
        }
      },
    },
  );

  return vscode.Disposable.from(...disposables);
}
