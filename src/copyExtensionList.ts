import { spawn, ChildProcessPromise, SpawnPromiseResult } from 'child-process-promise';
import osType from './modules/osType';
import { ICopyParam } from './ts/IParam';

export default async (param: ICopyParam): Promise<boolean> => {
  const { osOption, extensionList } = param;

  let command: ChildProcessPromise<SpawnPromiseResult>;
  if (osOption.includes((osType[2]))) {
    command = spawn('powershell', ['Set-Clipboard', '-Value', `"${extensionList.join('')}"`]);
  } else {
    command = spawn('sh', ['-c', `echo "${extensionList.join('')}" | xclip`]);
  }

  return await command
    .then(() => true)
    .catch((err) => false);
};
