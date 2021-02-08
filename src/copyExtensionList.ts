import { spawn, ChildProcessPromise, SpawnPromiseResult } from 'child-process-promise';
import { osArr } from './osObj';

export default async (osOption: string, extensionList: string[]) => {
  // 4. Copy extensions install command
  let command: ChildProcessPromise<SpawnPromiseResult>;

  if (osOption.includes((osArr[2]))) {
    command = spawn('powershell', ['Set-Clipboard', '-Value', `"${extensionList.join('')}"`]);
  } else {
    command = spawn('sh', ['-c', `echo "${extensionList.join('')}" | xclip`]);
  }

  return await command
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};
