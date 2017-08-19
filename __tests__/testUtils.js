const requestPromise = require('request-promise')
const api = process.env.API_URL || 'http://localhost:3200'

/* globals expect */
module.export.testEndpointSnapshot = (requestOptions, options = {}) => () =>
  requestPromise(
    Object.assign(
      {
        json: true
      },
      requestOptions
    )
  ).then(result =>
    expect(result).toMatchSnapshot(requestOptions.uri + options.snapShotName)
  )

module.export.testGetEndpoint = (endpoint, options = {}) =>
  module.exports.testEndpointSnapshot(
    {
      method: 'GET',
      uri: api + endpoint
    },
    options
  )
