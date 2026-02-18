import { type DependencyAlertsConfig } from "./config.js";
import { type DependencyAlertEvaluation } from "./types.js";
import { type SharedAlertsStatusBar } from "../shared/alertsStatusBar.js";
import { type SharedAlertsConfig } from "../shared/config.js";

const RUN_INSTALL_COMMAND = "npm-stuff.dependenciesAlerts.runInstall";
const DEPENDENCY_ALERT_KEY = "dependency-alerts";

export function renderDependencyAlertsStatus(
  statusBar: SharedAlertsStatusBar,
  dependencyConfig: DependencyAlertsConfig,
  sharedConfig: SharedAlertsConfig,
  evaluation: DependencyAlertEvaluation,
): void {
  if (!dependencyConfig.enabled) {
    statusBar.clearAlert(DEPENDENCY_ALERT_KEY);
    return;
  }

  const shouldShowOutOfSync = evaluation.status === "outOfSync";
  const shouldShowSynced =
    sharedConfig.alwaysShowAlertsEnabled &&
    (evaluation.status === "synced" || evaluation.status === "unknown");

  if (!shouldShowOutOfSync && !shouldShowSynced) {
    statusBar.clearAlert(DEPENDENCY_ALERT_KEY);
    return;
  }

  if (evaluation.status === "outOfSync") {
    statusBar.setAlert(DEPENDENCY_ALERT_KEY, {
      text: "$(warning) npm install required",
      tooltip: `npm-stuff: ${evaluation.reason}`,
      severity: "warning",
      command: RUN_INSTALL_COMMAND,
      priority: 90,
    });
    return;
  }

  if (evaluation.status === "unknown") {
    statusBar.setAlert(DEPENDENCY_ALERT_KEY, {
      text: "$(question) deps status unknown",
      tooltip: `npm-stuff: ${evaluation.reason}`,
      severity: "info",
      command: RUN_INSTALL_COMMAND,
      priority: 20,
    });
    return;
  }

  statusBar.setAlert(DEPENDENCY_ALERT_KEY, {
    text: "$(check) deps synced",
    tooltip: `npm-stuff: ${evaluation.reason}`,
    severity: "success",
    command: RUN_INSTALL_COMMAND,
    priority: 10,
  });
}
