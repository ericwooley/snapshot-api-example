// /knexfile.js

// Allow the env to set the database file, for integration test to use a different db file.
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // dev.sqlite3 for development
      // integration.sqlite3 for integration tests
      filename: process.env.DATABASE_FILE || './dev.sqlite3'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
