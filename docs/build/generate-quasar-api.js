#!/usr/bin/env node

const fs = require('fs-extra'),
  readline = require('readline'),
  path = require('path'),
  quasarPath = path.join(__dirname, '../node_modules/quasar'),
  docPagesPath = path.join(__dirname, '../src/pages'),
  componentsPath = path.join(quasarPath, 'src/components'),
  apiPath = path.join(quasarPath, 'dist/api'),
  quasarApi = {}

const apiReadPromises = []

const apis = fs.readdirSync(apiPath)
  .map(fileName => fileName.replace('.json', ''))
apis
  .forEach(apiName => {
    quasarApi[apiName] = {
      imports: [],
      related: []
    }

    const promise = fs.readFile(path.join(apiPath, apiName + '.json'), 'UTF-8').then(data => {
      const api = JSON.parse(data)
      quasarApi[apiName].api = api
    })

    apiReadPromises.push(promise)
  })

Promise.all(apiReadPromises)
  .then(() => {
    apis.forEach(apiName => {
      const api = quasarApi[apiName].api
      const docStream = fs.createReadStream(
        path.join(
          docPagesPath, 
          api.docs.route, 
          api.docs.page + '.md'
        )
      )

      const rl = readline.createInterface({
        input: docStream,
        output: () => {}
      })
      let dashCount = 0
      let description = ''
      rl.on('line', line => {
        if (dashCount === 1 && line.startsWith('  - ')) {
          let tokens = line.replace('  - /', '').split('/')
          let relatedRoute = tokens.slice(0, tokens.length - 1).join('/')
          let relatedPage = tokens[tokens.length - 1]
          for (let other in quasarApi) {
            if (quasarApi[other].api.docs.route === relatedRoute && quasarApi[other].api.docs.page === relatedPage) {
              quasarApi[apiName].related.push(other)
            }
          }
        }
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
  const compPath = path.join(componentsPath, componentDir)
  if (fs.lstatSync(compPath).isDirectory()) {
    fs.readdir(compPath)
      .then(files => {
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
                componentData.imports.push(matches[1])
              }
            })
          }
        })
      })
  }
})

process.on('exit', () => {
  let components = Object.entries(quasarApi).map(entry => {
    return {
      name: entry[0],
      ...entry[1]
    }
  }).filter(comp => {
    if (comp.imports.length) {
      return true
    }
    for (let otherCompName in quasarApi) {
      const otherComp = quasarApi[otherCompName]
      if (otherComp.name !== comp.name && otherComp.imports.includes(comp.name)) {
        return true
      }
    }
    return false
  })
  fs.writeFileSync(path.join(__dirname, '../src/statics/quasar-api.json'), JSON.stringify(components, '', 2))
})
