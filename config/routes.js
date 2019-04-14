const { authenticate } = require('../api/middleware/authenticate');
const authController = require('../api/controllers/auth');
const usersController = require('../api/controllers/users');
const categoriesController = require('../api/controllers/categories');

module.exports = server => {
  server.use('/api/users', usersController);
  server.use('/api/categories', categoriesController),
  server.use('/api', authController);
};
