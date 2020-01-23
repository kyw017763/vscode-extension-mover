import * as cpPromise from 'child-process-promise';

import { osArr } from './osObj';

export default async (osOption: string, extensionList: string[]) => {

  if (osOption.includes((osArr[2]))) {
    let noErr: boolean = true;
    extensionList.forEach(async (e: string) => {
      let execResult = await cpPromise.exec(`powershell code --uninstall-extension ${e}`)
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
  } else {
    let noErr = true;
    extensionList.forEach(async (e: string) => {
      let execResult = await cpPromise.exec(`code --uninstall-extension ${e}`)
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
  }
};
