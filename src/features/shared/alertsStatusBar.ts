import * as vscode from "vscode";

export type AlertSeverity = "warning" | "info" | "success";

export interface SharedAlertEntry {
  text: string;
  tooltip: string;
  severity: AlertSeverity;
  command?: string;
  priority?: number;
}

function severityPriority(severity: AlertSeverity): number {
  if (severity === "warning") {
    return 100;
  }

  if (severity === "info") {
    return 50;
  }

  return 10;
}

export class SharedAlertsStatusBar implements vscode.Disposable {
  private readonly statusBarItem: vscode.StatusBarItem;
  private readonly alerts = new Map<string, SharedAlertEntry>();

  public constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      30,
    );
    this.statusBarItem.name = "npm-stuff alerts";
  }

  public setAlert(key: string, alert: SharedAlertEntry | undefined): void {
    if (!alert) {
      this.alerts.delete(key);
    } else {
      this.alerts.set(key, alert);
    }

    this.render();
  }

  public clearAlert(key: string): void {
    this.alerts.delete(key);
    this.render();
  }

  public dispose(): void {
    this.statusBarItem.dispose();
  }

  private render(): void {
    if (this.alerts.size === 0) {
      this.statusBarItem.hide();
      return;
    }

    const activeAlert = [...this.alerts.entries()]
      .sort((a, b) => {
        const aPriority = a[1].priority ?? severityPriority(a[1].severity);
        const bPriority = b[1].priority ?? severityPriority(b[1].severity);

        if (aPriority === bPriority) {
          return a[0].localeCompare(b[0]);
        }

        return bPriority - aPriority;
      })
      .at(0)?.[1];

    if (!activeAlert) {
      this.statusBarItem.hide();
      return;
    }

    this.statusBarItem.text = activeAlert.text;
    this.statusBarItem.tooltip = activeAlert.tooltip;
    this.statusBarItem.command = activeAlert.command;
    this.statusBarItem.backgroundColor =
      activeAlert.severity === "warning"
        ? new vscode.ThemeColor("statusBarItem.warningBackground")
        : undefined;
    this.statusBarItem.show();
  }
}
