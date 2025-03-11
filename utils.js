import { createHash } from 'crypto';

export const generateHash = (data) => {
  return createHash('sha256').update(data).digest('hex');
};

export const formatKey = (key) => {
  return BigInt(key).toString(16).padStart(64, '0');
};