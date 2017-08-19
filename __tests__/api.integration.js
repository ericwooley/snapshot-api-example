// see https://github.com/request/request-promise
const requestPromise = require('request-promise')

// in case you want to mess with where the integration test happens
const api = process.env.API_URL || 'http://localhost:3200'

/************************************************************************
 * Test Setup Functions
 * These functions make our actual tests much shorter and readable
 ************************************************************************/

// this accepts request options, and returns a function that makes a request with those options
// which tests the result against a snapshot
const testEndpointSnapshot = (requestOptions, options = {}) =>
  // returns function, so you can pass it right into a test
  () =>
    // Makes a request with those options
    requestPromise(requestOptions).then(result =>
      // expect the result to match a snapshot named after the uri
      expect(result).toMatchSnapshot(
        requestOptions.method +
          ' ' +
          requestOptions.uri +
          (options.snapShotName || '')
      )
    )

// short cut for get requests, so all that you need to pass in is the uri
const testGetEndpoint = (endpoint, options = {}) =>
  testEndpointSnapshot(
    {
      method: 'GET',
      uri: api + endpoint
    },
    options
  )

/************************************************************************
 * Actual Tests
 * Where the actual tests are being described and run
 ************************************************************************/

// Describe the /products route
describe('/products', () => {
  // remember that `testGetEndpoint('/products/')` returns a function, which will be run as the test.
  it('should list all products', testGetEndpoint('/products/'))
  // remember that `testEndpointSnapshot({...})` returns a function, which will be run as the test.
  it(
    'should create a new product',
    testEndpointSnapshot({
      json: true,
      method: 'POST',
      uri: api + '/products/',
      body: {
        name: 'some product',
        description: 'shoes',
        price: 12.25
      }
    })
  )
})
