import * as cpPromise from 'child-process-promise';

import { osArr } from './osObj';

export default (async (osOption: string) => {
  let command: string;
  if (osOption.includes((osArr[2]))) {
    command = 'powershell code --list-extensions';
  } else {
    command = 'code --list-extensions';
  }

  return await cpPromise.exec(command)
    .then(function (result) {
      if (result.stderr) {
        return null;
      } else if (result.stdout) {
        return result.stdout;
      }
    })
    .catch(function (err) {
      return null;
    });
});
