import CryptoJS from 'crypto-js';
import secrets from '$lib/data/secrets?raw';
import type { Secrets } from '$lib/types';

export const setPassword = (password: string) => localStorage.setItem('password', password);
export const getPassword = () => localStorage.getItem('password');

export const checkIsLoggedIn = () => {
	try {
		return getSecrets().isLoggedIn;
	} catch {
		return false;
	}
};

export const getSecrets = (): Secrets => {
	const password = getPassword();
	if (!password) throw new Error('Need password to read secrets');

	const bytes = CryptoJS.AES.decrypt(secrets, password);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
