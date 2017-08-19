// /index.js
// Initial express setup, which connects to the database and serves products.
const port = process.env.API_PORT || 3000

const express = require('express')
const app = express()
var bodyParser = require('body-parser')
// development config from knex file.
// You probably want to use different ones based on environment variables
const knexConfig = require('./knexfile').development

// Our connected knex
const knex = require('knex')(knexConfig)

// use the body parser
app.use(bodyParser.json({ type: 'application/json' }))
// maybe show some documentation here? up to you!
app.get('/', function (req, res) {
  res.send('Hello World!')
})
// returns a list of all products
app.get('/products', (req, res) =>
  knex.select('*').from('products').then(products => res.send(products))
)
// create a product, req.body should be have a name, description, and price
app.post('/products', (req, res) =>
  knex
    .table('products')
    // Please take not that this is a TERRIBLE practice, and is only for demo purposes. Always validate and sanitize your input.
    .insert(req.body)
    // Send the created product as a response.
    .then(([id]) => knex.first('*').from('products').where({ id }))
    .then(product => res.send(product))
    // You also shouldn't return a raw error, an attacker could use this info to gain more insight into your app.
    // This is useful in development though.
    .catch(e => res.status(500).send(e))
)

// The port should be set by the enviornment variable, so that we can run one for dev, one for integration, etc...
app.listen(port, function () {
  console.log('example api running on port ' + port + '!')
})
