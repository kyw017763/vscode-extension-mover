import * as cpPromise from 'child-process-promise';
import * as os from 'os';
import { osArr } from './osObj';

export default async (osOption: string, extensionList: string, extensionCnt: number) => {
  const extensionListArr: string[] = extensionList.split(os.EOL);
  let preCommand: string;
  let command: string;

  if (osOption.includes((osArr[2]))) {
    preCommand = 'powershell Set-Clipboard -Value "`r`n"';
  } else {
    preCommand = 'echo "" | xclip';
  }

  // 4. Copy extensions install command
  let preResult = await cpPromise.exec(preCommand)
    .then(async function (setResult) {
      if (setResult.stderr) {
        throw new Error();
      }
      return true;
    })
    .catch((err) => {
      return false;
    });

  if (preResult) {
    extensionListArr.forEach(async (elem: string) => {
      if (osOption.includes((osArr[2]))) {
        command = 'powershell Set-Clipboard -Value "' + elem + '" -Append';
      } else {
        command = 'echo' + elem + '| xclip';
      }

      await cpPromise.exec(command)
      .then(async function (setResult) {
        if (setResult.stderr) {
          throw new Error(setResult.stderr);
        }
        return true;
      })
      .catch((err) => {
        return false;
      });
    });
  } else {
    return false;
  }
};
