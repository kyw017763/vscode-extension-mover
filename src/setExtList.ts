import * as vscode from 'vscode';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as os from 'os';
import * as cpPromise from 'child-process-promise';

import { osArr } from './osObj';

export default (async (osOption: string) => {

  const openFileOption: vscode.OpenDialogOptions = {
    openLabel: 'Get extension commands in this file',
    canSelectFiles: true,
    canSelectFolders: false,
    filters: {
      'Text': ['txt']
    }
  };
  
  let extensionList: any = await vscode.window.showOpenDialog(openFileOption)
    .then(fileUri => {
      if (fileUri && fileUri[0]) {
        return fs.readFileSync(path.resolve(fileUri[0].fsPath), 'UTF-8');
      } else {
        return null;
      }
    });

  if (!extensionList) {
    vscode.window.showErrorMessage('Execution aborted');
    return;
  }
  extensionList = extensionList.split(os.EOL);
  extensionList = extensionList.slice(0, extensionList.length -1);
  const extensionCnt = extensionList.length;

  let extensionListResult;

  if (osOption.includes((osArr[2]))) {
    extensionList.forEach(async (e: string) => {
      extensionListResult = await cpPromise.exec(`powershell ${e}`)
        .then(function (result) {
          if (result.stderr) {
            return false;
          } else {
            return true;
          }
        })
        .catch(function (err) {
          return false;
        });
    });
  } else {
    extensionList.forEach(async (e: string) => {
      extensionListResult = await cpPromise.exec(`${e}`)
        .then(function (result) {
          if (result.stderr) {
            return false;
          } else {
            return true;
          }
        })
        .catch(function (err) {
          return false;
        });
    });
  }

  if (extensionListResult) {
    vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n ${extensionCnt} extensions are installed!`);
  } else {
    vscode.window.showErrorMessage('Execution aborted');
  }
});
