exports.up = function(knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.timestamps();
    tbl.string('username', 128).notNullable().unique();
    tbl.string('password', 128).notNullable();
    tbl.string('email', 128).notNullable().unique();
    tbl.text('address');
    tbl.integer('loan_range').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
