const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

exports.handle = function (event, context, cb) {
  event = transform(event)
  if (!event.name) cb (new Error('Function name required.'))
  const params = {
    FunctionName: event.name,
    Payload: JSON.stringify(event)
  }
  lambda.invoke(params, (err, res) => {
    if (res) {
      try {
        var res = JSON.parse(res.Payload)
        cb(null, res)
      } catch (e) {
        cb(null, {status: 500, type: 'text/html', body: '<html><body><h1>Error processing response</h1></body><html>'})
      }
    } else {
      cb(null, {status: 404, type: 'text/html', body: '<html><body><h1>Function not found</h1></body><html>'})
    }
  })
}

function transform (event) {
  var name = event.name
  var url = event.url || '/'
  var headers = event.headers
  var host = headers.Host
  var base = '/'
  var body = event.body

  if (host === 'beta.weo.io') {
    name = 'weo_index'
  } else if (host === 'f.weo.io') {
    var urls = url.split('/')
    name = urls[1]
    url = '/' + urls.slice(2).join('/')
    base = '/' + name
  }
  return {name: name, url: url, headers: headers, base: base, body: body}
}
