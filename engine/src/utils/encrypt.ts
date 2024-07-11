import dotenv from 'dotenv';
dotenv.config();

import { encrypt } from 'commons/services/cryptoService';

function start() {
    const lastIndex = process.argv[process.argv.length - 1]; // get last command informed in terminal
    console.log(`Encrypting ${lastIndex}`);
    console.log(encrypt(lastIndex));
}

start();