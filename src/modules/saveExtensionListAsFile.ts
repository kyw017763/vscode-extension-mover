import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { ISaveParam } from '../ts/IParam';

export default async (param: ISaveParam): Promise<boolean | undefined> => {
  try {
    const { commandList } = param;

    const filename = await vscode.window.showInputBox({
      value: 'extension-mover',
      placeHolder: "Input file name you want",
      validateInput: function (input: string): null | string {
        return (/^[a-z0-9_.@()-]+/i).test(input) ? null : `The name of the txt file can't be that!`;
      },
      ignoreFocusOut: true,
    });
  
    if (!filename) {
      return false;
    }
  
    const saveDirOption: vscode.OpenDialogOptions = {
      openLabel: 'Save a file in this directory',
      canSelectFiles: false,
      canSelectFolders: true
    };
  
    const fileUri = await vscode.window.showOpenDialog(saveDirOption);
    if (fileUri && fileUri[0]) {
      console.log(fileUri);
      fs.writeFile(path.resolve(fileUri[0].fsPath, `${filename}.txt`), commandList.join(''), 'UTF-8', (err) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
  }
  catch (err) {
    console.log(err);
    return false;
  }
};
