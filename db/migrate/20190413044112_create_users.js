exports.up = function(knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.timestamps(true, true);
    tbl.string('firstname', 128)
    tbl.string('lastname', 128)
    tbl.string('username', 128).unique();
    tbl.string('password', 128).notNullable();
    tbl.string('email', 128).notNullable().unique();
    tbl.text('address');
    tbl.text('img_url');
    tbl.integer('loan_range').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
