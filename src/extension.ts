import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as os from 'os';
import * as path from 'path';

import saveAsFile from './saveAsFileExtensions';
import copy from './copyExtensions';
import getExtList from './getExtList';

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
    let extensionList: any = '';
    let extensionCnt: number = 0;

    // if OS === Windows
    extensionList = await getExtList();
    if (!extensionList) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    extensionList = extensionList.split('\n');
    extensionList = extensionList.slice(0, extensionList.length -1);
    extensionCnt = extensionList.length;

    let extensionListResult = '';
    extensionList.forEach((elem: any) => {
      extensionListResult += `code --install-extension ${elem}${os.EOL}`;
    });

    // fs.readdirSync(path.resolve(osObj[osOption]), {}).forEach((elem: any) => {
    //   extensionListResult += `code --install-extension ${elem}${os.EOL}`;
    //   extensionCnt++;
    // });

    // 3. Choose file vs copy-paste
    const commandArr = ['Save as text file', 'Copy'];
    const commandOption = await vscode.window.showQuickPick(commandArr, {
      placeHolder: 'Select ',
      ignoreFocusOut: true,
    });

    if (!commandOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    // 4. and...
    if (commandOption === commandArr[0]) {
      saveAsFile(extensionListResult, extensionCnt);
    } else if (commandOption === commandArr[1]) {
      copy(extensionListResult, extensionCnt);
    } else {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}