/**
 * Modules
 */

const terraGateway = require('terra-gateway')
const prosh = require('prosh')
const sonit = require('sonit')
const Schema = require('@weo-edu/schema')
const co = require('co')

exports.schema = Schema()
  .prop('domainMap', {type: 'object'})
  .required(['domainMap'])

exports.build = co.wrap(function * (opts) {
  try {
    yield sonit('lambda/domain-map.json', opts.domainMap)
    yield prosh(`
      browserify --node -s default --im -o lambda/build.js lambda/index.js
      touch -t 197101010000 lambda/build.js lambda/domain-map.json
      zip -X terra/lambda.zip lambda/*`)

    yield sonit('terra/gateway_override.tf.json', terraGateway(spec))
  } catch (e) {
    console.log('err', e)
  }

})

exports.clean = co.wrap(function * () {
  yield prosh(`
    rm lambda/domain-map.json
    rm lambda/build.js
    rm terra/lambda.zip
    rm terra/gateway_override.tf.json`)
})

const spec = {
  "id": "function_router",
  "name": "Function Router API",
  "description": "Route requests to functions.",
  "methods": {
    "GET": {
      "request": {
        "credentials": "${aws_iam_role.gateway_invoke_lambda.arn}",
        "lambda_arn": "${aws_lambda_function.function_router.arn}",
        "templates": {
          "application/json": {
            "body": "$input.json('$')",
            "name": "$input.params('name')",
            "url": "$url",
            "headers": {
              "Content-Type": "$input.params().get('Content-Type')",
              "Host": "$input.params().header.get('Host')",
              "cookie": "$input.params('cookie')",
            },
            "header-params": "$input.params().header"
          }
        }
      },
      "responses": {
        "200": {
          "models": {
            "application/json": "Empty",
            "text/html": "Empty"
          },
          "headers": {
            "Content-Type": "integration.response.body.type"
          },
          "body": {
            "application/json": "$input.path('$.body')"
          }
        }
      }
    }
  },
  "stage": "prod"
}
