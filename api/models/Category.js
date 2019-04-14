const db = require('../../config/db_config');

const find = () => db('categories');

const findById = id =>
  db('categories')
    .where({ id })
    .first();

const findByName = name =>
  db('categories')
    .where({ name })
    .first();

const insert = category =>
  db('categories')
    .insert(category)
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('categories')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('categories')
    .where({ id })
    .del();

module.exports = {
  find,
  findById,
  findByName,
  insert,
  update,
  remove
};

