
const path = require('path');
const validateProjectName = require('validate-npm-package-name')

async function create(projectName, options) {
  // is in current directory
  // const cwd = options.cwd || process.cwd()
  // const inCurrent = projectName === '.'
  // const name = inCurrent ? path.relative('../', cwd) : projectName
  // const targetDir = path.resolve(cwd, projectName || '.')
  // console.log(name, validateProjectName(name));
  let result = validateProjectName(projectName);
  if (!result.validForNewPackages) {
  }
}



module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}