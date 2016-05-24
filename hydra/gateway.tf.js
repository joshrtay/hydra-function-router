const terraGateway = require('terra-gateway')

module.exports = function * () {
  return terraGateway(spec)
}

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
