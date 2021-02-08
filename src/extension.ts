import * as vscode from 'vscode';
import * as os from 'os';
import osName from 'os-name';

import saveExtensionListAsFile from './saveExtensionListAsFile';
import copyExtensionList from './copyExtensionList';
import getExtensionList from './getExtensionList';

export function activate(context: vscode.ExtensionContext) {
  let exporter = vscode.commands.registerCommand('extension.exporter', async () => {

    // 1. Get os name
    const osOption: string = osName();

    // 2. Get extension list
    let extensionListArr: string[] = [];
    let extensionList: any = '';
    let extensionCnt: number = 0;

    extensionList = await getExtensionList(osOption);
    if (!extensionList) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    extensionListArr = extensionList.split('\n');
    extensionListArr = extensionListArr.slice(0, extensionListArr.length -1);
    extensionCnt = extensionListArr.length;

    const extensionListResult: string[] = [];
    extensionListArr.forEach((elem: string) => {
      extensionListResult.push(`code --install-extension ${elem}${os.EOL}`);
    });

    // 3. Choose file or Copy
    const commandArr: string[] = ['Save as text file', 'Copy'];
    const commandOption = await vscode.window.showQuickPick(commandArr, {
      placeHolder: 'Choose the way get commands',
      ignoreFocusOut: true,
    });

    if (!commandOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    // 4. and...
    let exportResult: boolean | undefined;
    if (commandOption === commandArr[0]) {
      exportResult = await saveExtensionListAsFile(extensionListResult, extensionCnt);
      if (exportResult) {
        vscode.window.showInformationMessage(`Hello, It\'s Extension Mover! ${extensionCnt} extension install command are saved!`);
      } else {
        vscode.window.showErrorMessage('Export execution aborted');
        return ;
      }
    } else if (commandOption === commandArr[1]) {
      exportResult = await copyExtensionList(osOption, extensionListResult);
      if (exportResult) {
        vscode.window.showInformationMessage(`Hello, It\'s Extension Mover! ${extensionCnt} extension install command are copied!`);
      } else {
        vscode.window.showErrorMessage('Export execution aborted');
        return ;
      }
    }
  });

  context.subscriptions.push(exporter);
}

export function deactivate() {}
