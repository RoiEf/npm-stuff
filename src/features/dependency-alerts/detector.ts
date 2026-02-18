import {
  type DependencyAlertEvaluation,
  type DependencyAlertTrigger,
} from "./types.js";

interface EvaluateAlertInput {
  desiredSignature?: string;
  hasDependencyEntries: boolean;
  baselineSignature?: string;
  hasInstallMarker: boolean;
  trigger: DependencyAlertTrigger;
}

export function evaluateDependencyAlert(
  input: EvaluateAlertInput,
): DependencyAlertEvaluation {
  if (!input.desiredSignature) {
    return {
      status: "unknown",
      reason: "No readable package.json found in workspace root.",
      desiredSignature: input.desiredSignature,
      baselineSignature: input.baselineSignature,
    };
  }

  if (!input.hasDependencyEntries) {
    return {
      status: "synced",
      reason:
        "No dependencies, devDependencies, or overrides are defined in package.json.",
      desiredSignature: input.desiredSignature,
      baselineSignature: input.desiredSignature,
    };
  }

  if (input.trigger === "install-marker" && input.hasInstallMarker) {
    return {
      status: "synced",
      reason: "Dependencies baseline refreshed after npm install activity.",
      desiredSignature: input.desiredSignature,
      baselineSignature: input.desiredSignature,
    };
  }

  if (!input.baselineSignature) {
    if (input.hasInstallMarker) {
      return {
        status: "synced",
        reason:
          "Initialized dependencies baseline from current workspace state.",
        desiredSignature: input.desiredSignature,
        baselineSignature: input.desiredSignature,
      };
    }

    return {
      status: "outOfSync",
      reason:
        "Dependencies appear not installed in this workspace. Run npm install.",
      desiredSignature: input.desiredSignature,
      baselineSignature: input.baselineSignature,
    };
  }

  if (input.baselineSignature === input.desiredSignature) {
    return {
      status: "synced",
      reason: "dependencies, devDependencies, and overrides are in sync.",
      desiredSignature: input.desiredSignature,
      baselineSignature: input.baselineSignature,
    };
  }

  return {
    status: "outOfSync",
    reason:
      "package.json dependency sections changed since last detected install activity.",
    desiredSignature: input.desiredSignature,
    baselineSignature: input.baselineSignature,
  };
}
