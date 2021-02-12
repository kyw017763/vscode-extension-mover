import { writeFile } from 'graceful-fs';
import { promisify } from 'util';

const WriteFileSync = promisify(writeFile);

export default { WriteFileSync };
