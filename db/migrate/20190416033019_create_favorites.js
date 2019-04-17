exports.up = function(knex) {
  return knex.schema.createTable('favorites', tbl => {
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
      .notNullable()
      .references('id')
      .inTable('tools')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExits('favorites');
};
