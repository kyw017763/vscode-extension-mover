import * as cpPromise from 'child-process-promise';
import osType from './modules/osType';
import { IGetParam } from './ts/IParam';

export default (async (param: IGetParam): Promise<string | null | undefined> => {
  const { osOption } = param;

  let command: string;
  if (osOption.includes((osType[2]))) {
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
