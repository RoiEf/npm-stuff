import * as vscode from "vscode";

export interface DependencyNameMatch {
  line: vscode.TextLine;
  lineIndex: number;
  packageName: string;
}

export function collectDependencyNameMatches(
  document: vscode.TextDocument,
): DependencyNameMatch[] {
  const matches: DependencyNameMatch[] = [];
  let lineIndex = 0;
  let shouldCheckForDependency = false;
  let shouldCheckForOverrides = false;
  let shouldCheckForPeerDependencies = false;

  while (lineIndex < document.lineCount) {
    const line = document.lineAt(lineIndex);

    if (shouldCheckForDependency) {
      if (line.text.includes("}")) {
        shouldCheckForDependency = false;
      } else {
        const lineMatches = line.text.match(/"(.*?)"/);

        if (lineMatches) {
          matches.push({ line, lineIndex, packageName: lineMatches[1] });
        }
      }
    } else if (shouldCheckForOverrides) {
      if (line.text.includes("}")) {
        if (shouldCheckForPeerDependencies) {
          shouldCheckForPeerDependencies = false;
        } else {
          shouldCheckForOverrides = false;
        }
      } else {
        shouldCheckForPeerDependencies = /: \{/.test(line.text);

        const lineMatches = line.text.match(/"(.*?)"/);

        if (lineMatches) {
          matches.push({ line, lineIndex, packageName: lineMatches[1] });
        }
      }
    } else {
      shouldCheckForDependency = /"(.*?)dependencies"/i.test(line.text);
      shouldCheckForOverrides = /"(.*?)overrides"/i.test(line.text);
    }

    lineIndex += 1;
  }

  return matches;
}
