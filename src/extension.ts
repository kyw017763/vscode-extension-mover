import * as vscode from 'vscode';
import * as os from 'os';

import optionArr from './osObj';
import saveAsFile from './saveAsFileExtensions';
import copy from './copyExtensions';
import getExtList from './getExtList';
import setExtList from './setExtList';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extension-mover" is now active!');

  let exporter = vscode.commands.registerCommand('extension.exporter', async () => {

    // 1. Select your OS
    const osOption = await vscode.window.showQuickPick(optionArr, {
      placeHolder: 'Select your OS',
      ignoreFocusOut: true,
    });

    if (!osOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    // 2. Get extension list
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

  let importer = vscode.commands.registerCommand('extension.importer', async () => {
    
    const osOption = await vscode.window.showQuickPick(optionArr, {
      placeHolder: 'Select your OS',
      ignoreFocusOut: true,
    });

    if (!osOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    setExtList(osOption);
  });

  context.subscriptions.push(exporter);
  context.subscriptions.push(importer);
}
export function deactivate() {}