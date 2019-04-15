const db = require('../../config/db_config');

const find = () => db('conditions');

const findById = id =>
  db('conditions')
    .where({ id })
    .first();

const findByName = name => db('conditions').where('name', 'like', `%${name}%`);

const insert = condition =>
  db('conditions')
    .insert(condition, 'id')
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('conditions')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('conditions')
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
