/**
 * Imports
 */

const test = require('tape')
const hydraform = require('hydraform')
const co = require('co')
const prosh = require('prosh')
const fs = require('mz/fs')
const {join} = require('path')

/**
 * Tests
 */

test('should build', co.wrap(function * (t) {
  try {
    const dir = yield hydraform({
      buildDir: 'test/hydra_modules',
      domainMap: {
        'f.weo.io/:name': {
          name: 'weo{name}',
          base: '/{name}'
        },
        ':name.weo.io': 'weo{name}'
      }
    })
    console.log('dir', dir)
    t.ok(fs.exists(join(dir, 'lambda_override.tf.json')))
    t.ok(fs.exists(join(dir, 'lambda/domin-map.json')))
    t.end()
  } catch (e) {
    console.log('e', e)
  }

}))

test('should be integrate with terraform', co.wrap(function * (t) {
  const dir = yield hydraform({
    buildDir: 'test/hydra_modules',
    domainMap: {
      'f.weo.io/:name': {
        name: 'weo{name}',
        base: '/{name}'
      },
      ':name.weo.io': 'weo{name}'
    }
  })
  yield prosh(`terraform plan ${dir}`)
  t.ok(true)
  t.end()
}))
