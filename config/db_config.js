const knex = require('knex');
const KnexQueryBuilder = require('knex/lib/query/builder');

const config = require('../knexfile.js');

const dbEnv = process.env.DB_ENV || 'development';
const knexConn = knex(config[dbEnv]);

KnexQueryBuilder.prototype.paginate = function(
  per_page = 30,
  current_page = 1
) {
  const page = Math.max(current_page || 1, 1);
  const offset = (page - 1) * per_page;
  const clone = this.clone();

  return Promise.all([
    this.offset(offset).limit(per_page),
    knexConn.count('*').from(clone.as('t1'))
  ]).then(([rows, total]) => {
    const count = parseInt(total.length > 0 ? total[0].count : 0);
    return {
      total: parseInt(count),
      per_page: per_page,
      offset: offset,
      to: offset + rows.length,
      last_page: Math.ceil(count / per_page),
      current_page: page,
      from: offset,
      results: rows
    };
  });
};

knexConn.queryBuilder = () => new KnexQueryBuilder(knexConn.client);

module.exports = knexConn;
