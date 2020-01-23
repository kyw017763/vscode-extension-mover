import * as cp from 'child_process';
import * as fs from 'graceful-fs';
import * as os from 'os';

fs.readFile('./extension-mover.txt', {encoding: 'UTF-8'}, (err, data) => {
  if(err) {
      console.log('There\'s no text file!');
  } else {
      let extensionArr: string[] = data.split(os.EOL);
      extensionArr.forEach(e => {
          cp.exec(`code --install-extension ${e}`, (err, stdout, stderr) => { });
      });
  }
});
