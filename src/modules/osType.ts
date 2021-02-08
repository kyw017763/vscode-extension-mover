import * as path from 'path';

const osObj = {
  macOS: `~/.vscode/extensions`,
  Linux: `~/.vscode/extensions`,
  Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions'),
};

export default Object.keys(osObj);
