const db = require('../../config/db_config');

const find = () => db('reviews');

const findById = id =>
  db('reviews')
    .where({ id })
    .first();

const findByName = name => db('reviews').where('name', 'like', `%${name}%`);

const insert = tool =>
  db('reviews')
    .insert(tool, 'id')
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('reviews')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('reviews')
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
