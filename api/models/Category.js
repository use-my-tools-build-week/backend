const db = require('../../config/db_config');

const find = () => db('categories');

const findById = id =>
  db('categories')
    .where({ id })
    .first();

const findByIdWithTools = (id, userId, page=1, limit=30) =>
  db('categories')
    .where({ id })
    .first()
    .then(category =>
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
        .orderBy('tools.distance', 'asc')
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
