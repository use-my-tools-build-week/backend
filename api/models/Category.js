const db = require('../../config/db_config');
const Tool = require('./Tool');

const find = () => db('categories');

const findById = id =>
  db('categories')
    .where({ id })
    .first();

const findByIdWithTools = (id, userId, page = 1, limit = 30) =>
  db('categories')
    .where({ id })
    .first()
    .then(category =>
      Tool.findWithFavorites(userId)
        .where({ category_id: category.id })
        .paginate(limit, page)
        .then(tools => ({ ...category, tools: tools }))
    );

const findByName = name => db('categories').where('name', 'like', `%${name}%`);

const insert = category =>
  db('categories')
    .insert(category, 'id')
    .then(ids => findById(ids[0]));

const insertWithTools = (category, userId) =>
  db('categories')
    .insert(category, 'id')
    .then(ids => findByIdWithTools(ids[0], userId));

const update = (id, changes) =>
  db('categories')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const updateWithTools = (changes, userId) =>
  db('categories')
    .where({ id })
    .update(changes)
    .then(() => findByIdWithTools(id, userId));

const remove = id =>
  db('categories')
    .where({ id })
    .del();

module.exports = {
  find,
  findById,
  findByIdWithTools,
  findByName,
  insert,
  insertWithTools,
  update,
  updateWithTools,
  remove
};
