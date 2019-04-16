require('dotenv').config();

// Update with your config settings.
const localPg = {
  host: 'localhost',
  database: 'use_my_tools',
  user: 'umt_user',
  password: 'umt_password'
};

const productionDbConnection = process.env.DATABASE_URL || localPg;

module.exports = process.env.KNEXFILE_PATH
  ? require(process.env.KNEXFILE_PATH)
  : {
      development: {
        client: 'sqlite3',
        connection: {
          filename: './db/dev.sqlite3'
        },
        useNullAsDefault: true,
        migrations: {
          directory: './db/migrate'
        },
        seeds: {
          directory: './db/seeds'
        }
      },

      testing: {
        client: 'sqlite3',
        connection: {
          filename: './db/test.sqlite3'
        },
        useNullAsDefault: true,
        migrations: {
          directory: './db/migrate'
        },
        seeds: {
          directory: './db/seeds'
        }
      },

      production: {
        client: 'pg',
        connection: productionDbConnection,
        migrations: {
          directory: './db/migrate'
        },
        seeds: {
          directory: './db/seeds'
        },
        ssl: true
      }
    };
