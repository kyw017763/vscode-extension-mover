import * as cpPromise from 'child-process-promise';

import optionArr from './osObj';

export default (async (osOption: string) => {
  if (osOption === optionArr[1]) {
    return await cpPromise.exec('powershell code --list-extensions')
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
  } else {
    return await cpPromise.exec('code --list-extensions')
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
  }
});