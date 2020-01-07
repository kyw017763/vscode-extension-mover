import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as os from 'os';
import * as path from 'path';

import saveAsFile from './saveAsFileExtensions';
import copy from './copyExtensions';

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

    // 3. Choose file vs copy-paste
    
    // 4. and...
    saveAsFile(extensionData, extensionCnt);
    copy(extensionData, extensionCnt);
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}