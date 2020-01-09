import * as cpPromise from 'child-process-promise';

export default (async () => {
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
});