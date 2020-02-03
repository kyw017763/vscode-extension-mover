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
    return false;
  }

  // 5. Select save dir
  const saveDirOption: vscode.OpenDialogOptions = {
    openLabel: 'Save in this directory',
    canSelectFiles: false,
    canSelectFolders: true
  };

  await vscode.window.showOpenDialog(saveDirOption).then(fileUri => {
    if (fileUri && fileUri[0]) {
      fs.writeFile(path.resolve(fileUri[0].fsPath, fileNameInput + '.txt'), extensionList, 'UTF-8', (err) => {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
  });
};
