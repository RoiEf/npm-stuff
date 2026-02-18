export type DependencyAlertStatus = "unknown" | "synced" | "outOfSync";

export type DependencyAlertTrigger =
  | "startup"
  | "package-json"
  | "package-lock"
  | "install-marker"
  | "git"
  | "manual-refresh"
  | "config-change";

export interface DependencyAlertEvaluation {
  status: DependencyAlertStatus;
  reason: string;
  desiredSignature?: string;
  baselineSignature?: string;
}