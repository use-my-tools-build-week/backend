const db = require('../../config/db_config');

const find = () => db('loan_requests');

const findById = id =>
  db('loan_requests')
    .where({ id })
    .first();

const findByLoanerId = id =>
  db('loan_requests')
    .where({ loaner_id: id })
    .first();

const findByToolId = id =>
  db('loan_requests')
    .where({ tool_id: id })
    .first();

const insert = ({ message, tool_id, user_id, loaner_id }) =>
  db('loan_requests')
    .insert({ message, tool_id, user_id, loaner_id }, 'id')
    .then(ids => findById(ids[0]));

const update = (id, changes) =>
  db('loan_requests')
    .where({ id })
    .update(changes)
    .then(() => findById(id));

const remove = id =>
  db('loan_requests')
    .where({ id })
    .del();

module.exports = {
  find,
  findById,
  findByLoanerId,
  findByToolId,
  insert,
  update,
  remove
};
