#! /usr/bin/env node

// Terminal string styling
const chalk = require('chalk')
// The semantic versioner for npm
const semver = require('semver')
// node least version
const requiredNodeVersion = require('../package.json').engines.node
const application = require('../package.json').name

/**
 * @desc check your node version
 * @param {string} minVersion: required least version of node
 * @param {string} application: application name
 */
function checkNodeVersion(minVersion, application) {
  if (!semver.satisfies(process.version, minVersion)) {
    console.log(chalk.red(
      `\nYour current node version: ${process.version}.` +
      `${application} requires node${minVersion}, please upgrade your node.\n`
    ));
    process.exit(1)
  }
}
checkNodeVersion(requiredNodeVersion, application);

// Solution for node.js command-line interfaces
const program = require('commander')
// Parse argument options
const minimist = require('minimist')

program
  .version(require('../package').version) // set application version
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project')
  // .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  // .option('-d, --default', 'Skip prompts and use default preset')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'));
    }
    require('../lib/create')(name, options)
  })

// Unrecognised command, output help
program
  .arguments('<command>')
  .action((cmd) => {
    console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    program.outputHelp()
    // better give some related cmds here
  })

// launch
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}