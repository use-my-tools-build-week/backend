exports.up = function(knex) {
  return knex.schema.createTable('tools', (tbl) => {
    tbl.increments();
    tbl.timestamps();
    tbl.string('name', 128).notNullable().unique();
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('category_id')
      .unsigned()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tools');
};
