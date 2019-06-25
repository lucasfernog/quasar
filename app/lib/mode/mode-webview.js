const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-webview'),
  warn = logger('app:mode-webview', 'red'),
  Extension = require('../app-extension/Extension.js'),
  extension = new Extension('@quasar/portal')

class Mode {
  get isInstalled() {
    return fs.existsSync(appPaths.webviewDir)
  }

  async add() {
    if (this.isInstalled) {
      warn(`WebView support detected already. Aborting.`)
      return
    }

    log('Creating WebView source folder...')

    fs.mkdirSync(appPaths.webviewDir)

    await extension.install(extension.isInstalled())
    log(`WebView support was installed`)
  }

  async remove() {
    if (!this.isInstalled) {
      warn(`No WebView support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.webviewDir)
    await extension.uninstall()
    log(`WebView support was removed`)
  }
}

module.exports = Mode
