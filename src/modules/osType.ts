import * as path from 'path';
import IOsType from '../ts/IOsType';

const osObj: IOsType = {
  macOS: path.resolve(`${process.env.HOME}`, '.vscode', 'extensions'),
  Linux: path.resolve(`${process.env.HOME}`, '.vscode', 'extensions'),
  Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions')
};

export default osObj;
export const osType = Object.keys(osObj);
