const db = require('../../config/db_config');

const find = () => db('users');

const findById = id =>
  db('users')
    .where({ id })
    .first();

const findByUsername = username =>
  db('users')
    .where({ username })
    .first();

const insert = user =>
  db('users')
    .insert(user, 'id')
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('users')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('users')
    .where({ id })
    .del();

module.exports = {
  find,
  findById,
  findByUsername,
  insert,
  update,
  remove
};
