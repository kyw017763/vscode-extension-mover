import cpPromise from 'child-process-promise';
import Pbcopy from './pbcopy';
import { osType } from './osType';
import { ICopyParam } from '../ts/IParam';

export default async (param: ICopyParam): Promise<boolean> => {
  try {
    const { osOption, commands } = param;

    let result: any = null;
    if (osOption.includes((osType[2]))) {
      result = await cpPromise.spawn('powershell', ['Set-Clipboard', '-Value', `"${commands}"`]);
    } else {
      result = await Pbcopy(commands);
    }
  
    if (result) {
      return true;
    }
    else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
