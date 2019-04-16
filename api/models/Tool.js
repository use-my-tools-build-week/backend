const db = require('../../config/db_config');

const find = (limit = 100, page = 1) =>
  db('tools')
    .limit(limit)
    .offset(page * limit);

const findById = id =>
  db('tools')
    .where({ id })
    .first();

const findByName = (name, limit = 100, page = 0) =>
  db('tools')
    .where('name', 'like', `%${name}%`)
    .limit(limit)
    .offset(page * limit);

const insert = tool =>
  db('tools')
    .insert(tool, 'id')
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('tools')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('tools')
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
