import * as path from 'path';
import os from 'os';
import IOsType from '../ts/IOsType';

const osObj: IOsType = {
  macOS: path.resolve(os.homedir(), '.vscode', 'extensions'),
  Linux: path.resolve(os.homedir(), '.vscode', 'extensions'),
  Windows: path.resolve(os.homedir(), '.vscode', 'extensions')
};

export default osObj;
export const osType = Object.keys(osObj);
