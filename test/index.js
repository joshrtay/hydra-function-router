/**
 * Imports
 */

const test = require('tape')
const {build, clean} = require('..')
const co = require('co')
const prosh = require('prosh')

/**
 * Tests
 */

test('should build and clean', co.wrap(function * (t) {
  yield build({
    domainMap: {
      'f.weo.io/:name': {
        name: 'weo-{name}',
        base: '/{name}'
      },
      ':name.weo.io': 'weo-{name}'
    }
  })
  yield prosh('TF_VAR_aws_region=us-west-2 terraform plan terra')
  yield clean()
  t.ok(true) //just cuz
  t.end()
}))
