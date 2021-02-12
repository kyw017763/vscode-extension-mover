import { spawn } from 'child-process-promise';
import Pbcopy from './pbcopy';
import osType from './osType';
import { ICopyParam } from '../ts/IParam';

export default async (param: ICopyParam): Promise<boolean> => {
  try {
    const { osOption, commandList } = param;

    let result: any = null;
    if (osOption.includes((osType[2]))) {
      result = await spawn('powershell', ['Set-Clipboard', '-Value', `"${commandList.join('')}"`]);
    } else {
      result = await Pbcopy(commandList.join(''));
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
