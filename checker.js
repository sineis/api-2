import CoinKey from 'coinkey';

export class AddressChecker {
  constructor(wallets) {
    this.wallets = new Set(wallets);
  }

  async check(key) {
    const ck = new CoinKey(Buffer.from(key, 'hex'));
    ck.compressed = true;
    
    const address = ck.publicAddress;
    const wif = ck.privateWif;

    if (this.wallets.has(address)) {
      return { found: true, key, address, wif };
    }
    return { found: false };
  }
}