import * as cpPromise from 'child-process-promise';

import optionArr from './osObj';

export default async (osOption: string, extensionList: string[]) => {

  if (osOption === optionArr[1]) {
    let noErr = true;
    extensionList.forEach(async (e: string) => {
      setTimeout(async () => {
        let execResult = await cpPromise.exec(`powershell code --uninstall-extension ${e}`)
        .then(function (result) {
          if (result.stderr) {
            console.log(result.stderr);
            return false;
          } else {
            console.log(result.stdout);
            return true;
          }
        })
        .catch(function (err) {
          return false;
        });
      if (!execResult) {
        noErr = execResult;
      }
      }, 2000);
    });
    return noErr;
  } else {
    let noErr = true;
    extensionList.forEach(async (e: string) => {
      setTimeout(async () => {
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
      }, 2000);
    });
    return noErr;
  }
};