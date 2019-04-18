const db = require('../../config/db_config');

const find = () =>
  db('favorites')
    .distinct('favorites.*')
    .select([
      'favorites.*',
      'tools.name',
      'tools.distance',
      'tools.img_url as tool_img_url',
      "conditions.name as 'condition'",
      'conditions.id as condition_id',
      'conditions.img_url as condition_img_url',
      'categories.name as category',
      'categories.id as category_id',
      'categories.img_url as category_img_url',
      'users.id as loaner_id',
      'users.firstname',
      'users.lastname',
      'users.img_url as loaner_img_url'
    ])
    .innerJoin('tools', 'tools.id', 'favorites.tool_id')
    .leftJoin('categories', 'categories.id', 'tools.category_id')
    .leftJoin('conditions', 'conditions.id', 'tools.condition_id')
    .leftJoin('users', 'users.id', 'tools.user_id');

const findById = id =>
  db('favorites')
    .where({ id })
    .first();

const findByUserId = userId => find().where({ 'favorites.user_id': userId });

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
