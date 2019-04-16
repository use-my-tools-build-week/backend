exports.up = function(knex) {
  return knex.schema.createTable('reviews', tbl => {
    tbl.increments();
    tbl.timestamps(true, true);
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('tool_id')
      .unsigned()
      .references('id')
      .inTable('tools')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    tbl.text('message');
    tbl.integer('score').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reviews');
};
