import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as path from 'path';

export default async (extensionList: string, extensionCnt: number) => {
  // 4. Input file name you want
  const fileNameInput = await vscode.window.showInputBox({
    value: 'extension-mover',
    placeHolder: "Input file name you want",
    validateInput: function (input: string): null | string {
      return (/^[a-z0-9_.@()-]+/i).test(input) ? null : `The name of the txt file can't be that!`;
    },
    ignoreFocusOut: true,
  });

  if (!fileNameInput) {
    vscode.window.showErrorMessage('Execution aborted');
    return;
  }

  // 4. Select save dir
  const saveDirOption: vscode.OpenDialogOptions = {
    openLabel: 'Save in this directory',
    canSelectFiles: false,
    canSelectFolders: true
  };

  await vscode.window.showOpenDialog(saveDirOption).then(fileUri => {
    if (fileUri && fileUri[0]) {
      fs.writeFile(path.resolve(fileUri[0].fsPath, fileNameInput + '.txt'), extensionList, 'UTF-8', (err) => {
        if (err) {
          vscode.window.showErrorMessage('Execution aborted');
          return;
        } else {
          vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n${extensionCnt} extension install command are saved!`);
        }
      });
    } else {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }
  });
};