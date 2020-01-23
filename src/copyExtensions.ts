import * as vscode from 'vscode';
import * as cpPromise from 'child-process-promise';
import * as os from 'os';

export default async (extensionList: string, extensionCnt: number) => {
  // 4. Copy extensions install command
  let preResult = await cpPromise.exec('powershell Set-Clipboard -Value "`r`n"')
    .then(async function (setResult) {
      if (setResult.stderr) {
        throw new Error();
      }
      return true;
    })
    .catch((err) => {
      vscode.window.showErrorMessage('Execution aborted');
      return false;
    });
  
  if (preResult) {
    extensionList.split(os.EOL).forEach(async (elem: string) => {
      await cpPromise.exec('powershell Set-Clipboard -Value "' + elem + '" -Append')
      .then(async function (setResult) {
        if (setResult.stderr) {
          throw new Error();
        }
        vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n${extensionCnt} extension install command are copied!`);
        return true;
      })
      .catch((err) => {
        vscode.window.showErrorMessage('Execution aborted');
        return false;
      });
    });
  } else {
    vscode.window.showErrorMessage('Execution aborted');
  }
};
