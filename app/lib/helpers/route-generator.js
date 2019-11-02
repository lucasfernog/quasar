const fs = require('fs'),
  path = require('path')

module.exports = path => {
  return generateRoutes(path, '', '', routeNameSeparator())
}

function kebabCase(str) {
  const result = str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => '-' + match.toLowerCase()
  )
  return (str[0] === str[0].toUpperCase()) ?
    result.substring(1) :
    result
}

function routeNameSeparator() {
  return '-'
}

function routeName(name) {
  return name.toLowerCase() === 'index'
    ? ''
    : kebabCase(name)
}

function generateRoutes(directoryPath, pathPrefix, namePrefix, routeNameSeparator) {
  const directoryContents = fs.readdirSync(directoryPath),
    entries = {}
  let routes = []

  for (const name of directoryContents) {
    if (name.startsWith('__')) {
      continue
    }
    const isDir = fs.lstatSync(path.join(directoryPath, name)).isDirectory(),
      entryName = name.replace('.vue', '')
      entryKey = `${isDir ? 'dir' : 'file'}-${entryName}`
    entries[entryKey] = {
      name: entryName,
      isDir
    }
  }

  for (const key of Object.keys(entries).sort()) {
    const entry = entries[key]
    if (entry === void 0) {
      // entry has been removed
      continue
    }
    if (entry.isDir) {
      const fileKey = `file-${entry.name}`,
        hasParent = fileKey in entries,
        dirRoutes = generateRoutes(
          path.join(directoryPath, entry.name),
          `${pathPrefix}/${entry.name}`,
          `${namePrefix ? (namePrefix + routeNameSeparator) : ''}${entry.name}`,
          routeNameSeparator
        )
      if (hasParent) {
        const parentRoute = generateRoute(entries, fileKey, pathPrefix, namePrefix, routeNameSeparator)
        parentRoute.children = dirRoutes
        routes.push(parentRoute)
        delete entries[`file-${entry.name}`]
      } else {
        routes = routes.concat(dirRoutes)
      }
    } else {
      routes[entry.name.startsWith('_') ? 'push' : 'unshift'](generateRoute(entries, key, pathPrefix, namePrefix, routeNameSeparator))
    }
  }

  return routes
}

function generateRoute (entries, key, pathPrefix, namePrefix, routeNameSeparator) {
  const entry = entries[key],
    route = {
      name: (namePrefix ? `${namePrefix}${routeNameSeparator}` : '') + routeName(entry.name),
      component: `src/pages${pathPrefix}/${entry.name}.vue`
    }
  let path = `${pathPrefix}/`
  if (entry.name.startsWith('_')) {
    path += `:${routeName(entry.name.replace('_', ''))}?`
  } else {
    path += routeName(entry.name.replace('_', ''))
  }

  route.path = path
  return route
}