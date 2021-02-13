import * as vscode from 'vscode';
import * as path from 'path';
import fsSync from '../modules/fsSync';
import { ISaveParam } from '../ts/IParam';

export default async (param: ISaveParam): Promise<boolean | undefined> => {
  try {
    const { commands } = param;

    const filename = await vscode.window.showInputBox({
      value: 'extension-mover',
      placeHolder: 'Please enter a new text file name!',
      validateInput: function (input: string): null | string {
        return (/^[A-z0-9_.@()-]+/i).test(input) ? null : 'Invalid text file name rule!';
      },
      ignoreFocusOut: true,
    });
  
    if (!filename) {
      return false;
    }
  
    const saveDirOption: vscode.OpenDialogOptions = {
      openLabel: 'Save file to this directory',
      canSelectFiles: false,
      canSelectFolders: true
    };
  
    const fileUri = await vscode.window.showOpenDialog(saveDirOption);
    if (fileUri && fileUri[0]) {
      await fsSync.WriteFileSync(path.resolve(fileUri[0].fsPath || fileUri[0].path, `${filename}.txt`), commands, 'UTF-8');
      return true;
    } else {
      return false;
    }
  }
  catch (err) {
    console.log(err);
    return false;
  }
};
