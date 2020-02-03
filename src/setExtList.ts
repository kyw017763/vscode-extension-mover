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
        return 0;
      }
    });

  if (!extensionList) {
    return 0;
  }

  extensionList = extensionList.split(os.EOL);
  extensionList = extensionList.slice(0, extensionList.length -1);

  let command: string;
  if (osOption.includes((osArr[2]))) {
    command = `powershell $e$`;
  } else {
    command = `$e$`;
  }

  extensionList.forEach(async (e: string) => {
    command = command.replace('$e$', e);
    await cpPromise.exec(command)
      .then(function (result) {
        if (result.stderr) {
          return 0;
        } else {
          return extensionList.length;
        }
      })
      .catch(function (err) {
        return 0;
      });
  });
});
