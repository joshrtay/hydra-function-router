const test = require('tape')

const transform = require('../hydra/lambda/transform')

test('should grab function name from subdomain', (t) => {
  const req = transform({
    params: {
      headers: {
        "Host": "func.foo.io"
      }
    },
    url: "/path1/path2",
    body: {
      bar: 'qux'
    }
  })
  t.deepEqual({
    name: 'foo-io-func',
    url: '/path1/path2',
    base: '/',
    body: {
      bar: 'qux'
    },
    headers: {
      "Host": "func.foo.io"
    }
  }, req)
  t.end()
})

test('should grab function name from first param in f subdomain', (t) => {
  const req = transform({
    params: {
      headers: {
        "Host": "f.foo.io"
      }
    },
    url: "/func/path1",
    body: {
      bar: 'qux'
    }
  })
  t.deepEqual({
    name: 'foo-io-func',
    url: '/path1',
    base: '/func',
    body: {
      bar: 'qux'
    },
    headers: {
      "Host": "f.foo.io"
    }
  }, req)
  t.end()
})
