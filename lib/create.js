// fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods.
const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path');
// check if project name valid
const validateProjectName = require('validate-npm-package-name')

const Creator = require('./Creator');

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd();

  // validate project name
  let result = validateProjectName(projectName);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`));
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1);
  }
  // obtain install directory
  const targetDir = path.resolve(cwd, projectName);
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Target directory ${chalk.yellow(targetDir)} already exists.`));
    process.exit(1);
  }
  // ready to deploy template
  const creator = new Creator(projectName, targetDir);
  await creator.create(options);

}



module.exports = (...args) => {
  return create(...args).catch(err => {
    console.error(chalk.red(err));
  })
}