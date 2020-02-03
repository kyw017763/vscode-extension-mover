import * as cpPromise from 'child-process-promise';

import { osArr } from './osObj';

export default async (osOption: string, extensionList: string[]) => {
  let command: string;
  if (osOption.includes((osArr[2]))) {
    command = `powershell code --uninstall-extension $e$`;
  } else {
    command = `code --uninstall-extension $e$`;
  }

  let execResult: boolean;
  let noErr: boolean = true;
  extensionList.forEach(async (e: string) => {
    command = command.replace('$e$', e);
    execResult = await cpPromise.exec(command)
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
    
    if (!execResult) {
      noErr = execResult;
    }
  });
  return noErr;
};
