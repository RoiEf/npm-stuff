// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function buildLink(
  line: vscode.TextLine,
  lineIndex: number,
  packageName: string,
) {
  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new vscode.Range(
    lineIndex,
    startCharacter,
    lineIndex,
    endCharacter,
  );
  const registryUrl =
    vscode.workspace.getConfiguration("npm-stuff").registryUrl;
  const linkUri = vscode.Uri.parse(`${registryUrl}${packageName}`);
  return new vscode.DocumentLink(linkRange, linkUri);
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerDocumentLinkProvider(
    { language: "json", pattern: "**/package.json" },
    {
      provideDocumentLinks(document) {
        const links = [];
        let lineIndex = 0;
        let shouldCheckForDependency = false;
        let shouldCheckForOverrides = false;
        let shouldCheckForPeerDependencies = false;

        while (lineIndex < document.lineCount) {
          const line = document.lineAt(lineIndex);

          if (shouldCheckForDependency) {
            // no need to check for dependencies if block ended
            if (line.text.includes("}")) {
              shouldCheckForDependency = false;
            } else {
              // find dependency
              const matches = line.text.match(/"(.*?)"/);

              if (matches) {
                links.push(buildLink(line, lineIndex, matches[1]));
              }
            }
          } else if (shouldCheckForOverrides) {
            // no need to check for overrides if block ended
            if (line.text.includes("}")) {
              if (shouldCheckForPeerDependencies) {
                shouldCheckForPeerDependencies = false;
              } else {
                shouldCheckForOverrides = false;
              }
            } else {
              // check if we are in a peerDependencies block
              shouldCheckForPeerDependencies = /: \{/.test(line.text);

              // find dependency
              const matches = line.text.match(/"(.*?)"/);

              if (matches) {
                links.push(buildLink(line, lineIndex, matches[1]));
              }
            }
          } else {
            // check if we are in a dependencies or overrides block
            shouldCheckForDependency = /"(.*?)dependencies"/i.test(line.text);
            shouldCheckForOverrides = /"(.*?)overrides"/i.test(line.text);
          }

          lineIndex += 1;
        }

        return links;
      },
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
