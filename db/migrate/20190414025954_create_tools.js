exports.up = function(knex) {
  return knex.schema
    .createTable('conditions', tbl => {
      tbl.increments();
      tbl.timestamps(true, true);
      tbl
        .string('name', 128)
        .notNullable()
        .unique();
      tbl.text('image_url');
      tbl
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    })
    .createTable('tools', tbl => {
      tbl.increments();
      tbl.integer('distance')
      tbl.timestamps(true, true);
      tbl
        .string('name', 128)
        .notNullable()
        .unique();
      tbl.text('image_url');
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
      tbl
        .integer('condition_id')
        .unsigned()
        .references('id')
        .inTable('conditions')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExits('conditions').dropTableIfExists('tools');
};
