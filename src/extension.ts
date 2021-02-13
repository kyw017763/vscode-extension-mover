import * as vscode from 'vscode';
import open from 'open';
import * as os from 'os';
import osName from 'os-name';
import osObj, { osType } from './modules/osType';
import fsSync from './modules/fsSync';
import getExtensionList from './modules/getExtensionList';
import saveExtensionListAsFile from './modules/saveExtensionListAsFile';
import copyExtensionList from './modules/copyExtensionList';

export function activate(context: vscode.ExtensionContext) {
  const exporter = vscode.commands.registerCommand('extension.exporter', async () => {
    const osOption: string = osName();

    let extensionListStr: string | boolean | undefined = await getExtensionList({ osOption });
    if (!extensionListStr || typeof extensionListStr !== 'string') {
      vscode.window.showErrorMessage('Exportation Execution aborted');
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
      ignoreFocusOut: true
    });

    if (!commandOption) {
      vscode.window.showErrorMessage('Exportation Execution aborted');
      return;
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
      vscode.window.showInformationMessage(`Hello, It\'s Extension Mover! ${extensionCnt} extension install commands are ${exportResultStr}!`);
      return;
    }
    vscode.window.showErrorMessage('Exportation execution aborted');
  });

  const uninstaller = vscode.commands.registerCommand('extension.uninstaller', async () => {
    const uninstallOption: string[] = ["Yes", "No"];
    const result: string | undefined = await vscode.window.showInformationMessage("Would you like to unintall all vscode extensions?", ...uninstallOption);
    if (result !== uninstallOption[0]) {
      return vscode.window.showErrorMessage('Unintallation execution aborted');
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
      placeHolder: "Input extension path and check (If inputbox is empty, execution will be aborted)",
      ignoreFocusOut: true
    });
    if (!extensionPath) {
      vscode.window.showErrorMessage('Unintall execution aborted');
      return;
    }

    const isExists = await fsSync.AccessFileSync(extensionPath);
    if (!isExists) {
      vscode.window.showErrorMessage('Unintall execution aborted');
      return;
    }

    vscode.window.showInformationMessage("Please remove this directory directly!");

    setTimeout(() => { open(extensionPath); }, 1000);
  });

  context.subscriptions.push(exporter);
  context.subscriptions.push(uninstaller);
}

export function deactivate() {}
