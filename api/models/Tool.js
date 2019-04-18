const db = require('../../config/db_config');
// const knex = require('knex');

const find = () => db('tools').orderBy('distance', 'asc');
const findWithFavorites = userId =>
  db('tools')
    .distinct('tools.*')
    .select(
      'tools.*',
      'users.firstname',
      'users.lastname',
      'users.img_url as loaner_img_url',
      'categories.name as category_name',
      'conditions.name as condition_name',
      db.raw(
        `CASE WHEN favorites.user_id = ${userId} THEN 1 ELSE 0 END is_favorited`
      ),
      db.raw(
        `CASE WHEN loan_requests.user_id = ${userId} THEN 1 ELSE 0 END is_requested`
      )
    )
    .from('tools')
    .leftJoin('users', 'users.id', 'tools.user_id')
    .leftJoin('favorites', 'users.id', 'favorites.user_id')
    .leftJoin('loan_requests', 'users.id', 'loan_requests.user_id')
    .leftJoin('conditions', 'conditions.id', 'tools.condition_id')
    .leftJoin('categories', 'categories.id', 'tools.category_id')
    .orderBy('tools.distance', 'asc');

const findByIdWithFavorites = (id, userId) =>
  db('tools')
    .select(
      'tools.*',
      'users.firstname',
      'users.lastname',
      'users.img_url as loaner_img_url',
      'categories.name as category_name',
      'conditions.name as condition_name',
      db.raw(
        `CASE WHEN favorites.user_id = ${userId} THEN 1 ELSE 0 END is_favorited`
      ),
      db.raw(
        `CASE WHEN loan_requests.user_id = ${userId} THEN 1 ELSE 0 END is_requested`
      )
    )
    .from('tools')
    .leftJoin('users', 'users.id', 'tools.user_id')
    .leftJoin('favorites', 'users.id', 'favorites.user_id')
    .leftJoin('loan_requests', 'users.id', 'loan_requests.user_id')
    .leftJoin('conditions', 'conditions.id', 'tools.condition_id')
    .leftJoin('categories', 'categories.id', 'tools.category_id')
    .where({ 'tools.id': id })
    .first();

const findById = id =>
  db('tools')
    .where({ id })
    .first();

const findByName = name =>
  db('tools')
    .where('name', 'like', `%${name}%`)
    .orderBy('distance', 'asc');

const myToolsWithName = (name, userId) =>
  findWithFavorites(userId)
    .where('tools.name', 'like', `%${name}%`)
    .where({ 'tools.user_id': userId });

const myTools = userId =>
  findWithFavorites(userId).where({ 'tools.user_id': userId });

const findByNameWithFavorites = (name, userId) =>
  findWithFavorites(userId).where('tools.name', 'like', `%${name}%`);

const insert = tool =>
  db('tools')
    .insert({ ...tool, distance: Math.floor(Math.random() * 1000) }, 'id')
    .then(ids => findById(ids[0]));

const insertWithFavorites = (tool, userId) =>
  db('tools')
    .insert({ ...tool, distance: Math.floor(Math.random() * 1000) }, 'id')
    .then(ids => findByIdWithFavorites(ids[0], userId));

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
  myTools,
  myToolsWithName,
  findByNameWithFavorites,
  findByIdWithFavorites,
  findWithFavorites,
  insertWithFavorites,
  insert,
  update,
  remove
};
