import { createInterface } from 'readline';
import chalk from 'chalk';
import { KeyGenerator } from './keyGenerator.js';
import { AddressChecker } from './checker.js';
import { Logger } from './logger.js';
import config from './config.js';
import ranges from './ranges.js';
import wallets from './wallets.js';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

class App {
  constructor() {
    this.logger = new Logger();
    this.checker = new AddressChecker(wallets);
    this.running = true;
  }

  async start() {
    await this.selectPuzzle();
    await this.startSearch();
  }

  async selectPuzzle() {
    return new Promise((resolve) => {
      rl.question(this.getMenuText(), async (answer) => {
        const puzzle = parseInt(answer);
        if (this.validatePuzzle(puzzle)) {
          this.setRange(puzzle);
          resolve();
        }
      });
    });
  }

  getMenuText() {
    return chalk.yellow(`
    ██████╗ ████████╗███████╗     ██████╗ ██╗   ██╗███████╗███████╗██╗░░░░░███████╗
    ██╔══██╗╚══██╔══╝██╔════╝    ██╔═══██╗██║   ██║╚══███╔╝╚══███╔╝██║░░░░░██╔════╝
    ██████╔╝   ██║   █████╗      ██║   ██║██║   ██║  ███╔╝   ███╔╝ ██║░░░░░█████╗░░
    ██╔══██╗   ██║   ██╔══╝      ██║   ██║██║   ██║ ███╔╝   ███╔╝  ██║░░░░░██╔══╝░░
    ██║  ██║   ██║   ███████╗    ╚██████╔╝╚██████╔╝███████╗███████╗███████╗███████╗
    ╚═╝  ╚═╝   ╚═╝   ╚══════╝     ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝
    
    ${chalk.cyan('Selecione um puzzle (1-160):')} `);
  }

  validatePuzzle(puzzle) {
    if (puzzle < 1 || puzzle > 160) {
      console.log(chalk.red('Erro: Escolha um número entre 1 e 160'));
      process.exit(1);
    }
    return true;
  }

  setRange(puzzle) {
    const range = ranges[puzzle - 1];
    this.keyGenerator = new KeyGenerator(range.min, range.max);
    console.log(chalk.green(`Puzzle ${puzzle} selecionado. Intervalo: ${range.min} - ${range.max}`));
  }

  async startSearch() {
    console.log(chalk.yellow('\nIniciando busca... (Pressione CTRL+C para parar)\n'));
    
    for await (const key of this.keyGenerator.generateKeys()) {
      if (!this.running) break;
      
      this.logger.incrementCount();
      const result = await this.checker.check(key);
      
      if (result.found) {
        this.logger.logFound(result);
        this.running = false;
        process.exit(0);
      }
    }
  }
}

// Inicialização da aplicação
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nBusca interrompida pelo usuário.'));
  process.exit();
});

new App().start();