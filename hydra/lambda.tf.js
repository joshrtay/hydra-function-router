const zip = require('node-lambda-zip')
const sonit = require('sonit')
const {join} = require('path')

module.exports = {
  resource: {
    aws_lambda_function: {
      function_router: {
        filename: function * (params) {
          yield sonit(join(__dirname, 'lambda/domain-map.json'), params.domainMap || {})
          return yield zip('lambda', 'lambda.zip', {cwd: __dirname})
        },
        function_name: "hydra_function_router",
        role: "${aws_iam_role.lambda_function.arn}",
        handler: "build.default",
        source_code_hash: '${base64sha256(file("${path.module}/lambda.zip"))}'
      }
    }
  }
}
