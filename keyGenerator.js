import crypto from 'crypto';
import { formatKey } from './utils.js';

export class KeyGenerator {
  constructor(min, max) {
    this.min = BigInt(min);
    this.max = BigInt(max);
    this.range = this.max - this.min + 1n;
  }

  generate() {
    const randomBuffer = crypto.randomBytes(32);
    const randomHex = randomBuffer.toString('hex');
    return this.min + (BigInt(`0x${randomHex}`) % this.range;
  }

  async *generateKeys() {
    while (true) {
      yield formatKey(this.generate());
      await new Promise(resolve => setImmediate(resolve));
    }
  }
}