// Node's event emitter for all engines.
const EventEmitter = require('events')
const chalk = require('chalk')
// Process execution for humans
const execa = require('execa')
const ora = require('ora');
// A collection of common interactive command line user interfaces.
const inquirer = require('inquirer')
// Download and extract a git repository (GitHub, GitLab, Bitbucket) from node.
const downloader = require('download-git-repo')

const writeFileTree = require('../lib/util/writeFileTree')

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super();

    this.name = name;
    this.context = context;

    this.run = this.run.bind(this)
  }

  async create() {
    const { run, name, context } = this;
    console.log(chalk.blue.bold(`${require('../package.json').name.toUpperCase()} v${require('../package.json').version}`));
    const spinner = ora(`Creating project in ${chalk.yellow(context)}.`);
    spinner.start();
    this.emit('creation', { event: 'creating' });
    spinner.stopAndPersist({
      symbol: '✨',
      text: `Creating project in ${chalk.yellow(context)}.`
    })
    const { version, desc, plugins } = await inquirer.prompt([
      {
        type: 'input',
        name: 'version',
        message: `Set project version`,
        default: '1.0.0',
      },
      {
        type: 'input',
        name: 'desc',
        message: `Set project description`,
        default: 'project created by mz-cli',
      },
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Choose plugins',
        choices: [
          'vue-router', 'vuex', 'qrcode'
        ],
        filter: function(val) {
          return val;
        }
      }
    ]);
    // generate package.json with plugin dependencies
    const pkg = {
      name,
      version: version,
      private: true,
      description: desc,
      devDependencies: {}
    }
    spinner.text = ' ' + 'Downloading template repository';
    spinner.start();
    downloader('michaelji520/mz-vue-template', context, (err) => {
      if (err) {
        console.log(chalk.red(err));
      }
      spinner.stopAndPersist({
        symbol: '✔',
        text: `Downloading template repository complete.`
      })
    });
    // write package.json
    // await writeFileTree(context, {
    //   'package.json': JSON.stringify(pkg, null, 2)
    // })
  }
  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
      return execa(command, args, { cwd: this.context });
    }
  }
}