import { spawn } from 'child-process-promise';
import pbcopy from './pbcopy';
import osType from './osType';
import { ICopyParam } from '../ts/IParam';

export default async (param: ICopyParam): Promise<boolean> => {
  try {
    const { osOption, extensionList } = param;

    let result: any = null;
    if (osOption.includes((osType[2]))) {
      result = await spawn('powershell', ['Set-Clipboard', '-Value', `"${extensionList.join('')}"`]);
    } else {
      result = await pbcopy(extensionList.join(''));
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
