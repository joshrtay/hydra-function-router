

exports.error = function () {
  return {
    status: 500,
    type: 'text/html',
    body: '<html><body><h1>Error processing response</h1></body><html>'
  }
}

exports.notFound = function () {
  return {
    status: 404,
    type: 'text/html',
    body: '<html><body><h1>Function not found</h1></body><html>'
  }
}
