import * as cp from 'child_process';
import * as fs from 'graceful-fs';
import * as os from 'os';

cp.exec('code --list-extensions', (err, stdout, stderr) => {
  if(err) {
    return;
  }

  let extensionArr: string[] = stdout.split('\n');
  extensionArr = extensionArr.slice(0, extensionArr.length -1);

  let w: string = '';
  let i: number = 0;

  extensionArr.forEach(e => {
    i++;
    cp.exec(`code --uninstall-extension ${e}`, (err, stdout, stderr) => { });
    w += `code --install-extension ${e}` + os.EOL;
  });

  if(i > 0) {
    fs.writeFile('extension-mover.txt', w, 'UTF-8', (err) => {
      if (err) {
        return ;
      } else {
        console.log('Making extension-mover Text File!');
      }
    });
  } else {
      console.log('There\'s no extension!');
  }
});
