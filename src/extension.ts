import * as vscode from 'vscode';
import * as os from 'os';
import osName from 'os-name';
import getExtensionList from './modules/getExtensionList';
import saveExtensionListAsFile from './modules/saveExtensionListAsFile';
import copyExtensionList from './modules/copyExtensionList';

export function activate(context: vscode.ExtensionContext) {
  let exporter = vscode.commands.registerCommand('extension.exporter', async () => {
    const osOption: string = osName();

    let extensionListStr: string | boolean | undefined = await getExtensionList({ osOption });
    if (!extensionListStr || typeof extensionListStr !== 'string') {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }

    let extensionListArr: string[] = extensionListStr.split('\n');
    extensionListArr = extensionListArr.slice(0, extensionListArr.length -1);
    const extensionCnt = extensionListArr.length;

    const commandList: string[] = [];
    extensionListArr.forEach((elem: string) => {
      commandList.push(`code --install-extension ${elem}${os.EOL}`);
    });

    const commandOptions: string[] = ['Save as a file', 'Copy to clipboard'];
    const commandOption = await vscode.window.showQuickPick(commandOptions, {
      placeHolder: 'Choose the way get commands',
      ignoreFocusOut: true,
    });

    if (!commandOption) {
      vscode.window.showErrorMessage('Execution aborted');
      return;
    }
    
    let exportResult: boolean | undefined = false;
    let exportResultStr: string = '';
    if (commandOption === commandOptions[0]) {
      exportResult = await saveExtensionListAsFile({ commandList });
      exportResultStr = 'saved';
    } else if (commandOption === commandOptions[1]) {
      exportResult = await copyExtensionList({ osOption, extensionList: extensionListArr });
      exportResultStr = 'copied';
    }

    if (exportResult) {
      vscode.window.showInformationMessage(`Hello, It\'s Extension Mover! ${extensionCnt} extension install commands are ${exportResultStr}!`);
    }
    else {
      vscode.window.showErrorMessage('Export execution aborted');
      return;
    }
  });

  context.subscriptions.push(exporter);
}

export function deactivate() {}
