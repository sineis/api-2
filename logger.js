import fs from 'fs';
import chalk from 'chalk';
import config from './config.js';

export class Logger {
  constructor() {
    this.startTime = Date.now();
    this.count = 0;
    this.setupMetrics();
  }

  setupMetrics() {
    setInterval(() => this.showStats(), config.UPDATE_INTERVAL);
  }

  logFound({ key, address, wif }) {
    const entry = `\n[${new Date().toISOString()}] Found!\nKey: ${key}\nAddress: ${address}\nWIF: ${wif}\n`;
    fs.appendFileSync(config.LOG_FILE, entry);
    console.log(chalk.red('\n★★★★★ BITCOIN ENCONTRADO! ★★★★★'));
    console.log(chalk.yellow(entry));
  }

  showStats() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const keysPerSec = (this.count / elapsed).toFixed(2);
    console.log(chalk.cyan(`\nEstatísticas:`));
    console.log(`Chaves testadas: ${this.count.toLocaleString()}`);
    console.log(`Velocidade: ${keysPerSec} chaves/segundo`);
    console.log(`Tempo decorrido: ${elapsed.toFixed(2)} segundos`);
  }

  incrementCount() {
    this.count++;
  }
}