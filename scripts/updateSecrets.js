import CryptoJS from 'crypto-js';
import secrets from '../.secrets.json' assert { type: 'json' };
import fs from 'fs';

const appRoot = process.cwd();
const secretsFilePath = `${appRoot}/src/lib/data/secrets`;
const password = process.argv[2];

const encrypt = (data) => CryptoJS.AES.encrypt(data, password).toString();
const decrypt = (data) => CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8);

try {
	fs.unlinkSync(secretsFilePath);
} catch {
	// Nothing
}

const encryptedData = encrypt(JSON.stringify(secrets));

fs.writeFileSync(secretsFilePath, encryptedData, { flag: 'w+' });

const writtenSecrets = fs.readFileSync(secretsFilePath, 'utf-8');
const decryptedSecrets = decrypt(writtenSecrets);

console.log(`You just encrypted these secrets: ${decryptedSecrets}`);
