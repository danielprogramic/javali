const fs = require('fs')
const path = require('path').join
const fullPath = require('path')
const wrench = require('wrench')
const runPath = process.cwd()
const template = require('./template')
const log = require('./log')

const isFolderExistsSync = dir => {
  try {
    fs.accessSync(dir)
    return true
  } catch (e) {
    return false
  }
}

async function create (app, ts) {
  const fullPathFolder = path(runPath, app)
  const fullPathTemplate = path(
    fullPath.resolve(__dirname),
    `../../templates/${ts ? 'ts' : 'js'}`
  )

  if (isFolderExistsSync(fullPathFolder)) {
    log(`Folder "${app}" already exists`, 'error')
  } else {
    const filesToRename = ['_babelrc', '_editorconfig', '_gitignore', '_npmrc', '_package']
    const filesFinal = ['.babelrc', '.editorconfig', '.gitignore', '.npmrc', 'package.json']

    await wrench.copyDirSyncRecursive(fullPathTemplate, fullPathFolder, {
      excludeHiddenUnix: false
    })

    filesToRename.map((item, index) => {
      fs.renameSync(
        fullPath.resolve(fullPathFolder, item),
        fullPath.resolve(fullPathFolder, filesFinal[index])
      )
    })

    log(`Project folder "${app}" was created =]`, 'success')
    template(app)
  }
}

module.exports = create
