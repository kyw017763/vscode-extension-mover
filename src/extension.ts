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

    let extensions: string | null | undefined = await getExtensionList({ osOption });
    if (!extensions || typeof extensions !== 'string') {
      return vscode.window.showErrorMessage(MESSAGE.EXPORTATION_EXECUTION_ABORTED);
    }

    let extensionList: string[] = extensions.split('\n');
    extensionList = extensionList.slice(0, extensionList.length - 1);
    const extensionCnt = extensionList.length;

    const commandList: string[] = [];
    extensionList.forEach((elem: string) => commandList.push(`code --install-extension ${elem}${os.EOL}`));

    const commandOptions: string[] = ['Save as File', 'Save to Clipboard'];
    const commandOption = await vscode.window.showQuickPick(commandOptions, {
      placeHolder: 'Select where to save the command',
      ignoreFocusOut: true
    });

    if (!commandOption) {
      return vscode.window.showErrorMessage(MESSAGE.INVALID_VALUE);
    }
    
    let exportResult: boolean | undefined = false;
    let exportStatus: string = '';
    if (commandOption === commandOptions[0]) {
      exportResult = await saveExtensionListAsFile({ commands: commandList.join('') });
      exportStatus = 'saved';
    } else if (commandOption === commandOptions[1]) {
      exportResult = await copyExtensionList({ osOption, commands: commandList.join('') });
      exportStatus = 'copied';
    }

    if (exportResult) {
      return vscode.window.showInformationMessage(MESSAGE.EXPORTATION_EXECUTION_RESULT(extensionCnt, exportStatus));
    }

    vscode.window.showErrorMessage(MESSAGE.EXPORTATION_EXECUTION_ABORTED);
  });

  const deletingHelper = vscode.commands.registerCommand('extension.deletingHelper', async () => {
    const deletingHelpOptions: string[] = ["Yes", "No"];
    const result: string | undefined = await vscode.window.showInformationMessage('Would you like to delete all the vscode extensions?', ...deletingHelpOptions);
    if (result !== deletingHelpOptions[0]) {
      return vscode.window.showInformationMessage(MESSAGE.HELPING_DELETION_EXECUTION_ABORTED);
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
      placeHolder: `Enter the vscode extension path (default: ${defaultExtensionPath})`,
      ignoreFocusOut: true
    });
    if (!extensionPath) {
      return vscode.window.showErrorMessage(MESSAGE.INVALID_VALUE);
    }

    const isExists = await fsSync.AccessFileSync(extensionPath);
    if (!isExists) {
      return vscode.window.showErrorMessage(MESSAGE.IS_NOT_EXISTS);
    }

    vscode.window.showInformationMessage('Please delete the directory yourself for accurate operation!');

    setTimeout(() => { open(extensionPath); }, 1000);
  });

  context.subscriptions.push(exporter);
  context.subscriptions.push(deletingHelper);
}

export function deactivate() {}
