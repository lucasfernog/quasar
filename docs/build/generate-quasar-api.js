#!/usr/bin/env node

const fs = require('fs-extra'),
  readline = require('readline'),
  path = require('path'),
  quasarPath = '../node_modules/quasar',
  docPagesPath = '../src/pages',
  componentsPath = path.join(quasarPath, 'src/components'),
  apiPath = path.join(quasarPath, 'dist/api'),
  quasarApi = {},
  docPages = {
    component: 'vue-components',
    directive: 'vue-directives',
    plugin: 'quasar-plugins'
  }

const apis = fs.readdirSync(apiPath)
  .map(fileName => fileName.replace('.json', ''))
apis
  .forEach(apiName => {
    quasarApi[apiName] = {
      related: []
    }

    fs.readFile(path.join(apiPath, apiName + '.json'), 'UTF-8', (err, data) => {
      if (err) {
        throw err
      }

      const api = JSON.parse(data)
      quasarApi[apiName].api = api

      let apiDocFileName = apiName.startsWith('Q') ? apiName.slice(1) : apiName
      apiDocFileName = apiDocFileName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

      const docStream = fs.createReadStream(
        path.join(
          docPagesPath, 
          (api.docs && api.docs.route) || docPages[api.type], 
          ((api.docs && api.docs.page) || apiDocFileName) + '.md'
        )
      )

      const rl = readline.createInterface({
        input: docStream,
        output: () => {}
      })
      let dashCount = 0
      let description = ''
      rl.on('line', line => {
        if (line.startsWith('---')) {
          dashCount++
        }
        else if (dashCount === 2 && line.length !== 0) {
          if (line.startsWith(':::') || line.startsWith('##')) {
            dashCount++ // breaks description +=
            quasarApi[apiName].description = description
          }
          else {
            if (description) {
              description += '\n'
            }
            description += line
          }
        }
      })
    })
  })

fs.readdirSync(componentsPath).forEach(componentDir => {
  const group = 'Q' + componentDir.split('-').map(c => c[0].toUpperCase() + c.slice(1)).join('')
  fs.readdir(path.join(componentsPath, componentDir), (err, files) => {
    if (err) {
      throw err
    }

    files.forEach(file => {
      let component = ''
      if (file.endsWith('.js') && apis.includes(component = file.replace('.js', ''))) {
        const componentData = quasarApi[component]
        componentData.group = group

        const componentStream = fs.createReadStream(path.join(componentsPath, componentDir, file))
        const rl = readline.createInterface({
          input: componentStream,
          output: () => {}
        })

        rl.on('line', line => {
          let matches = null
          if ((matches = /import (\S+) from/g.exec(line)) != null && apis.includes(matches[1])) {
            componentData.related.push(matches[1])
          }
        })
      }
    })
  })
})

process.on('exit', () => {
  let components = Object.entries(quasarApi).map(entry => {
    return {
      name: entry[0],
      ...entry[1]
    }
  }).filter(comp => {
    if (comp.related.length) {
      return true
    }
    for (let otherCompName in quasarApi) {
      const otherComp = quasarApi[otherCompName]
      if (otherComp.name !== comp.name && otherComp.related.includes(comp.name)) {
        return true
      }
    }
    return false
  })
  fs.writeFileSync('../src/statics/quasar-api.json', JSON.stringify(components, '', 2))
})
