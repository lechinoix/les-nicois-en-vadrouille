import { nanoid } from 'nanoid';

const NANO_ID_SIZE = 7;

export const generateId = () => nanoid(NANO_ID_SIZE);
