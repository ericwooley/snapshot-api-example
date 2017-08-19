// seeds/products.js

// This is a basic knex seed, which adds 3 products
// see http://knexjs.org/#Seeds-CLI
exports.seed = function (knex, Promise) {
  // delete all products
  return knex('products').del().then(function () {
    // Inserts seed entries
    return knex('products').insert([
      { id: 1, name: 'p1', description: 'product 1', price: 3.93 },
      { id: 2, name: 'p1', description: 'product 2', price: 2.62 },
      { id: 3, name: 'p1', description: 'product 3', price: 14.97 }
    ])
  })
}
