exports.up = function(knex) {
  return knex.schema.createTable('loan_requests', tbl => {
    tbl.increments();
    tbl.timestamps();
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('loaner_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
    tbl
      .integer('tool_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('tools')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl.text('message');
    tbl.string('status', 128).notNullable().defaultTo('pending');
    tbl.boolean('has_been_seen').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExits('loan_requests');
};
