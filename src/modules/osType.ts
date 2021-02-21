import * as path from 'path';
import os from 'os';
import OsType from '../ts/OsType';

const osObj: OsType = {
  macOS: path.resolve(os.homedir(), '.vscode', 'extensions'),
  Linux: path.resolve(os.homedir(), '.vscode', 'extensions'),
  Windows: path.resolve(os.homedir(), '.vscode', 'extensions')
};

export default osObj;
export const osType = Object.keys(osObj);
