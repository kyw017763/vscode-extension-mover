import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as os from 'os';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extension-mover" is now active!');

  let disposable = vscode.commands.registerCommand('extension.mover', async () => {

    const osObj: any = {
      macOS: `~/.vscode/extensions`,
      Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions'),
      Linux: `~/.vscode/extensions`,
    };

    const optionArr: string[] = Object.keys(osObj);

    // 1. Select your OS
    const osOption = await vscode.window.showQuickPick(optionArr, {
      placeHolder: 'Select your OS',
      ignoreFocusOut: true,
    });

    if (!osOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    // 2. Make txt file's content
    let extensionData: string = '';
    let extensionCnt: number = 0;

    // code --list-extensions
    fs.readdirSync(path.resolve(osObj[osOption]), {}).forEach((elem: any) => {
      extensionData += `code --install-extension ${elem}${os.EOL}`;
      extensionCnt++;
    });

    // 3. Input file name you want
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
        fs.writeFile(path.resolve(fileUri[0].fsPath, fileNameInput + '.txt'), extensionData, 'UTF-8', (err) => {
          if (err) {
            vscode.window.showErrorMessage('Execution aborted');
            return;
          } else {
            vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!${os.EOL}${extensionCnt} extension install command are saved!`);
          }
        });
      } else {
        vscode.window.showErrorMessage('Execution aborted');
        return;
      }
    });

  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}