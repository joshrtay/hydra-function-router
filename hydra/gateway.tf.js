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
          "application/json": mappingTemplate()
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

function mappingTemplate () {
  return `#set($allParams = $input.params())
  {
  "body" : $input.json('$'),
  "url": $url,
  "params" : {
  #foreach($type in $allParams.keySet())
      #set($params = $allParams.get($type))
  "$type" : {
      #foreach($paramName in $params.keySet())
      "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
          #if($foreach.hasNext),#end
      #end
  }
      #if($foreach.hasNext),#end
  #end
  },
  "context" : {
      "account-id" : "$context.identity.accountId",
      "api-id" : "$context.apiId",
      "api-key" : "$context.identity.apiKey",
      "authorizer-principal-id" : "$context.authorizer.principalId",
      "caller" : "$context.identity.caller",
      "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
      "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
      "cognito-identity-id" : "$context.identity.cognitoIdentityId",
      "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
      "http-method" : "$context.httpMethod",
      "stage" : "$context.stage",
      "source-ip" : "$context.identity.sourceIp",
      "user" : "$context.identity.user",
      "user-agent" : "$context.identity.userAgent",
      "user-arn" : "$context.identity.userArn",
      "request-id" : "$context.requestId",
      "resource-id" : "$context.resourceId",
      "resource-path" : "$context.resourcePath"
      }
  }`
}
