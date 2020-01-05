import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extension-mover" is now active!');
  
  let disposable = vscode.commands.registerCommand('extension.mover', async () => {
    
    const osObj = {
      macOS: `~/.vscode/extensions`,
      Windows: `%USERPROFILE%\.vscode\extensions`,
      Linux: `~/.vscode/extensions`,
    };

    const optionArr: string[] = [];
    for (const os in osObj) {
      optionArr.push(os);
    }

    // 1. Select your OS
    const osOption = await vscode.window.showQuickPick(optionArr, {
      placeHolder: 'Select your OS',
      ignoreFocusOut: true,
    });

    if (!osOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return ;
    }

    // 2. Input file name you want
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
      return ;
    }

    // 3. Select save dir
    const saveDirOption: vscode.OpenDialogOptions = {
      openLabel: 'Save in this directory',
      canSelectFiles: false,
      canSelectFolders: true
    };

    let saveDir;

    await vscode.window.showOpenDialog(saveDirOption).then(fileUri => {
      if (fileUri && fileUri[0]) {
        saveDir = fileUri[0].fsPath;
        fs.writeFile(path.resolve(fileUri[0].fsPath, fileNameInput+'.txt'), '', 'UTF-8', (err) => {
          if (err) {
            return;
          } else {
            vscode.window.showInformationMessage('Hello, It\'s Extension Mover!');
          }
        });
      } else {
        vscode.window.showErrorMessage('Execution aborted');
        return ;
      }
    });

    console.log(optionArr);
    console.log(osOption);
    console.log(fileNameInput);
    console.log(saveDir);
  });
  context.subscriptions.push(disposable);
}
export function deactivate() {}