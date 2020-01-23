import * as path from 'path';

const osObj = {
  macOS: `~/.vscode/extensions`,
  Linux: `~/.vscode/extensions`,
  Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions'),
};

const osArr = Object.keys(osObj);

export { osObj, osArr };
