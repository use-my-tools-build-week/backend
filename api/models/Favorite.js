const db = require('../../config/db_config');

const find = () => db('favorites');

const findById = id =>
  db('favorites')
    .where({ id })
    .first();

const findByUserId = userId => db('favorites').where({ user_id: userId });

const insert = tool => db('favorites').insert(tool, 'id');

const update = (id, changes) =>
  db('favorites')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('favorites')
    .where({ id })
    .del();

module.exports = {
  find,
  findById,
  findByUserId,
  insert,
  update,
  remove
};
