import * as vscode from "vscode";

export function buildDependencyLink(
  line: vscode.TextLine,
  lineIndex: number,
  packageName: string,
  registryUrl: string,
): vscode.DocumentLink {
  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new vscode.Range(
    lineIndex,
    startCharacter,
    lineIndex,
    endCharacter,
  );
  const linkUri = vscode.Uri.parse(`${registryUrl}${packageName}`);

  return new vscode.DocumentLink(linkRange, linkUri);
}