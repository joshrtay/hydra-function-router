const {join} = require('path')
const opts = require('./opts.json')
const UrlPattern = require('url-pattern')
const format = require('string-template')
const isString = require('@f/is-string')

const keys = Object.keys(opts)
const patterns = keys.map(p => new UrlPattern(p))

module.exports = transform

function transform (event) {
  var name = event.name

  var headers = event.params.headers
  var host = headers.Host
  var url = join(host, event.url || '/')
  var base = '/'
  var body = event.body


  for (var i = 0; i < patterns.length; i++) {
    let m = patterns[i].match(url)
    if (m) {
      url = m._
      let interpolate = opts[keys[i]]
      if (isString(interpolate)) {
        name = format(interpolate, m)
      } else {
        name = format(interpolate.name, m)
        if (base) {
          base = format(interpolate.base, m)
        }
      }
    }
  }

  if (url[0] !== '/')
    url = '/' + url

  return {name: name, url: url, headers: headers, base: base, body: body}
}
