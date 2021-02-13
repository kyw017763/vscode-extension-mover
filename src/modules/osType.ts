import * as path from 'path';

const osObj = {
  macOS: path.resolve('~', '.vscode', 'extensions'),
  Linux: path.resolve('~', '.vscode', 'extensions'),
  Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions')
};

export default osObj;
export const osType = Object.keys(osObj);
