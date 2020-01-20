import * as vscode from 'vscode';
import * as cpPromise from 'child-process-promise';
import * as os from 'os';

export default async (extensionList: string, extensionCnt: number) => {
  // 4. Copy extensions install command
  let copyExtensionList = '';
  extensionList.split(os.EOL).forEach((elem: string) => {
    copyExtensionList += elem.replace(os.EOL, '`r`');
  });
  console.log(extensionList);
  console.log(copyExtensionList);
  
  return await cpPromise.exec('powershell Set-Clipboard -V "'+ copyExtensionList +'"')
    .then(function (result) {
      if (result.stderr) {
        console.log('실패');
        return false;
      } else if (result.stdout) {
        console.log('성공');
        vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n${extensionCnt} extension install command are copied!`);
        return true;
      }
    })
    .catch(function (err) {
      console.log('아예 에러'+err);
      return false;
    });
};