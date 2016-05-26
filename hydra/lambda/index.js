const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

const transform = require('./transform')
const response = require('./response')

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
        cb(null, response.error())
      }
    } else {
      cb(null, response.notFound())
    }
  })
}
