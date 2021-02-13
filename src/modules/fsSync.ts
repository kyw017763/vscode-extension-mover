import { writeFile, access } from 'graceful-fs';
import { promisify } from 'util';

const WriteFileSync = promisify(writeFile);
const AccessFileSync = async (path: string) => {
    try {
        await promisify(access)(path);
        return true;
    }
    catch (err) {
        return false;
    }
};

export default { WriteFileSync, AccessFileSync };
