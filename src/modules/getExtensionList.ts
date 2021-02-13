import * as cpPromise from 'child-process-promise';
import { osType } from './osType';
import { IGetParam } from '../ts/IParam';

export default (async (param: IGetParam): Promise<string | boolean | undefined> => {
  try {
    const { osOption } = param;

    let command: string;
    if (osOption.includes((osType[2]))) {
      command = 'powershell code --list-extensions';
    } else {
      command = 'code --list-extensions';
    }
  
    const result = await cpPromise.exec(command);
    if (result.stderr) {
      return false;
    } else if (result.stdout) {
      return result.stdout;
    }
  } catch (err) {
    return false;
  }
});
