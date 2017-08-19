// migrations/20170819134815_products.js

// Initial migration which adds the products table
exports.up = function (knex, Promise) {
  return knex.schema.createTable('products', function (t) {
    t.increments('id').unsigned().primary()
    t.string('name').notNull()
    t.text('description').nullable()
    t.decimal('price', 6, 2).notNull()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('products')
}
