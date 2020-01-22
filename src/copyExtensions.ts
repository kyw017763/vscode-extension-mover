import * as vscode from 'vscode';
import * as cpPromise from 'child-process-promise';
import * as os from 'os';

export default async (extensionList: string, extensionCnt: number) => {
  // 4. Copy extensions install command
  let copyExtensionList = '';
  extensionList.split(os.EOL).forEach((elem: string) => {
    copyExtensionList += elem.replace(os.EOL, '{0}');
  });
  
  console.log(copyExtensionList);
  
  return await cpPromise.exec("powershell $str = '" + copyExtensionList + "' -f [System.Environment]::NewLine")
    .then(async function (setResult) {
      if (setResult.stderr) {
        vscode.window.showErrorMessage('Execution aborted111');
        return false;
      }
      console.log(setResult.stdout);
      return await cpPromise.exec('powershell Set-Clipboard -Value $str')
        .then(function (result) {
          if (result.stderr) {
            vscode.window.showErrorMessage('Execution aborted222');
            return false;
          }

          console.log(result.stdout);
          vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n${extensionCnt} extension install command are copied!`);
          return true;
        })
        .catch((err) => {
          vscode.window.showErrorMessage('Execution aborted333'+err);
          return false;
        });
    })
    .catch((err) => {
      vscode.window.showErrorMessage('Execution aborted444'+err);
      return false;
    });
};