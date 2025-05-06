import crypto from 'crypto';

export const hashMD5 = (texto) => {
    return crypto.createHash('md5').update(texto).digest('hex');
};