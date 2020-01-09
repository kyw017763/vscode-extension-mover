import * as vscode from 'vscode';
import * as os from 'os';

import optionArr from './osObj';
import saveAsFile from './saveAsFileExtensions';
import copy from './copyExtensions';
import getExtList from './getExtList';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extension-mover" is now active!');

  let disposable = vscode.commands.registerCommand('extension.mover', async () => {

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

    extensionList = await getExtList(osOption);
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

    // 3. Choose file vs copy-paste
    const commandArr = ['Save as text file', 'Copy'];
    const commandOption = await vscode.window.showQuickPick(commandArr, {
      placeHolder: 'Choose the way get commands',
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