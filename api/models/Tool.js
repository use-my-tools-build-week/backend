const db = require('../../config/db_config');

const find = () => db('tools').orderBy('distance', 'asc');

const findWithFavorites = userId =>
  db('tools')
    .select(
      'tools.*',
      'users.firstname',
      'users.lastname',
      'users.img_url as loaner_img_url',
      'categories.name as category_name',
      'conditions.name as condition_name',
      'f.is_favorited',
      'l.is_loaner',
      'l.is_borrower'
    )
    .leftJoin(
      db('favorites')
        .select(
          'favorites.id as favorite_id',
          'favorites.tool_id',
          db.raw(
            'case when favorites.id is null then 0 else 1 end is_favorited'
          )
        )
        .from('favorites')
        .where({ 'favorites.user_id': userId })
        .as('f'),
      'f.tool_id',
      '=',
      'tools.id'
    )
    .leftJoin(
      db('loan_requests')
        .select(
          'loan_requests.id as loan_request_id',
          'loan_requests.tool_id',
          'loan_requests.user_id as borrower_id',
          db.raw(
            `case when loan_requests.loaner_id = ${userId} then 1 else 0 end is_loaner`,
          ),
          db.raw(
            `case when loan_requests.user_id = ${userId} then 1 else 0 end is_borrower`
          )
        )
        .from('loan_requests')
        .where({ 'loan_requests.user_id': userId })
        .orWhere({ 'loan_requests.loaner_id': userId })
        .as('l'),
      'l.tool_id',
      '=',
      'tools.id'
    )
    .leftJoin('users', 'users.id', '=', 'tools.user_id')
    .leftJoin('conditions', 'conditions.id', '=', 'tools.condition_id')
    .leftJoin('categories', 'categories.id', '=', 'tools.category_id')
    .orderBy('tools.distance', 'asc');

const findByIdWithFavorites = (id, userId) =>
  findWithFavorites(userId).where({ 'tools.id': id}).first();

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
