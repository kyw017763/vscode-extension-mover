export default (data: string) => {
    return new Promise<boolean>(function(resolve, reject) {
      const proc = require('child_process').spawn('pbcopy');
      proc.on('error', function(err: any) {
        reject(err);
      });
      proc.on('close', function(err: any) {
        resolve(true);
      });
      proc.stdin.write(data);
      proc.stdin.end();
    });
};
