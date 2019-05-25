const
  log = require('../helpers/logger')('app:webview'),
  {
    spawn
  } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths')

class WebViewRunner {
  constructor() {
    this.pid = 0

    onShutdown(() => {
      this.stop()
    })
  }

  run(quasarConfig) {
    const
      cfg = quasarConfig.getBuildConfig(),
      url = cfg.build.APP_URL

    if (this.url === url) {
      return
    }

    if (this.pid) {
      this.stop()
    }

    this.url = url

    const args = ['--url', url, '--debug']

    return this.__runWebViewCommand(
      cfg,
      args
    )
  }

  build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    // TODO: pass index filename to the executable
    return this.__runWebViewCommand(
      cfg,
      cfg.ctx.debug ? ['--debug'] : []
    )
  }

  stop() {
    return new Promise((resolve, reject) => {
      const finalize = () => {
        this.__stopWebView().then(resolve)
      }

      finalize()
    })
  }

  __runWebViewCommand(cfg, args) {
    const appExecutable = 'app',
      buildArgs = ['build', '-o', appExecutable]

    return new Promise(resolve => {
      spawn('go',
        buildArgs,
        appPaths.webviewDir,
        code => {
          if (code) {
            warn(`⚠️  [FAIL] go command has failed`)
            process.exit(1)
          }
          spawn(`./${appExecutable}`, 
            args, 
            appPaths.webviewDir,
            code => {
              if (code) {
                warn()
                warn(`⚠️  Webview process ended with error code: ${code}`)
                warn()
                process.exit(1)
              }

              if (this.killPromise) {
                this.killPromise()
                this.killPromise = null
              }
              else { // else it wasn't killed by us
                warn()
                warn('Webview process was killed. Exiting...')
                warn()
                process.exit(0)
              }
              resolve(code)
            }
          )
        }
      )
    })
  }

  __stopWebView () {
    const pid = this.pid

    if (!pid) {
      return Promise.resolve()
    }

    log('Shutting down WebView process...')
    this.pid = 0
    return new Promise((resolve, reject) => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }
}

module.exports = new WebViewRunner()
