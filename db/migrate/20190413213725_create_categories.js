exports.up = function(knex) {
  return knex.schema.createTable('categories', (tbl) => {
    tbl.increments();
    tbl.timestamps(true, true);
    tbl.string('name', 128).notNullable().unique();
    tbl.text('image_url');
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');
};
