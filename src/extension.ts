import * as vscode from 'vscode';
import open from 'open';
import * as os from 'os';
import osName from 'os-name';
import osObj, { osType } from './modules/osType';
import fsSync from './modules/fsSync';
import MESSAGE from './modules/messages';
import getExtensionList from './modules/getExtensionList';
import saveExtensionListAsFile from './modules/saveExtensionListAsFile';
import copyExtensionList from './modules/copyExtensionList';

export function activate(context: vscode.ExtensionContext) {
  const exporter = vscode.commands.registerCommand('extension.exporter', async () => {
    const osOption: string = osName();

    let extensionListStr: string | boolean | undefined = await getExtensionList({ osOption });
    if (!extensionListStr || typeof extensionListStr !== 'string') {
      return vscode.window.showErrorMessage(MESSAGE.EXPORTATION_EXECUTION_ABORTED);
    }

    let extensionListArr: string[] = extensionListStr.split('\n');
    extensionListArr = extensionListArr.slice(0, extensionListArr.length - 1);
    const extensionCnt = extensionListArr.length;

    const commandList: string[] = [];
    extensionListArr.forEach((elem: string) => commandList.push(`code --install-extension ${elem}${os.EOL}`));

    const commandOptions: string[] = ['Save as File', 'Save to Clipboard'];
    const commandOption = await vscode.window.showQuickPick(commandOptions, {
      placeHolder: 'Select where to save the command',
      ignoreFocusOut: true
    });

    if (!commandOption) {
      return vscode.window.showErrorMessage(MESSAGE.INVALID_VALUE);
    }
    
    let exportResult: boolean | undefined = false;
    let exportResultStr: string = '';
    if (commandOption === commandOptions[0]) {
      exportResult = await saveExtensionListAsFile({ commands: commandList.join('') });
      exportResultStr = 'saved';
    } else if (commandOption === commandOptions[1]) {
      exportResult = await copyExtensionList({ osOption, commands: commandList.join('') });
      exportResultStr = 'copied';
    }

    if (exportResult) {
      return vscode.window.showInformationMessage(MESSAGE.EXPORTATION_EXECUTION_RESULT(extensionCnt, exportResultStr));
    }

    vscode.window.showErrorMessage(MESSAGE.EXPORTATION_EXECUTION_ABORTED);
  });

  const deletingHelper = vscode.commands.registerCommand('extension.deletingHelper', async () => {
    const deletingHelpOption: string[] = ["Yes", "No"];
    const result: string | undefined = await vscode.window.showInformationMessage('Would you like to delete all the vscode extensions?', ...deletingHelpOption);
    if (result !== deletingHelpOption[0]) {
      return vscode.window.showInformationMessage(MESSAGE.DELETING_HELP_EXECUTION_ABORTED);
    }

    const osOption: string = osName();
    let defaultExtensionPath: string = '';
    if (osOption.includes(osType[2])) {
      defaultExtensionPath = osObj[osType[2]];
    } else if (osOption.includes(osType[0])) {
      defaultExtensionPath = osObj[osType[0]];
    }

    const extensionPath = await vscode.window.showInputBox({
      value: defaultExtensionPath,
      placeHolder: 'Please enter the vscode extension path and confirm! (If the input window is empty, the execution will be aborted!)',
      ignoreFocusOut: true
    });
    if (!extensionPath) {
      return vscode.window.showErrorMessage(MESSAGE.INVALID_VALUE);
    }

    const isExists = await fsSync.AccessFileSync(extensionPath);
    if (!isExists) {
      return vscode.window.showErrorMessage(MESSAGE.IS_NOT_EXISTS);
    }

    vscode.window.showInformationMessage('Please delete the vscode extension directory yourself!');

    setTimeout(() => { open(extensionPath); }, 1000);
  });

  context.subscriptions.push(exporter);
  context.subscriptions.push(deletingHelper);
}

export function deactivate() {}
