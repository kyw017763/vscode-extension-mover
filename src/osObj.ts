import * as path from 'path';

const osObj = {
  macOS: `~/.vscode/extensions`,
  Windows: path.resolve(`${process.env.USERPROFILE}`, '.vscode', 'extensions'),
  Linux: `~/.vscode/extensions`,
};

export default Object.keys(osObj);

// Failed
// fs.readdirSync(path.resolve(osObj[osOption]), {}).forEach((elem: any) => {
//   extensionListResult += `code --install-extension ${elem}${os.EOL}`;
//   extensionCnt++;
// });