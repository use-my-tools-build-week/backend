const { authenticate } = require('../api/middleware/authenticate');
const authController = require('../api/controllers/auth');
const usersController = require('../api/controllers/users');
const categoriesController = require('../api/controllers/categories');
const conditionsController = require('../api/controllers/conditions');
const toolsController = require('../api/controllers/tools');

module.exports = server => {
  server.use('/api', authController);
  server.use('/api/users', usersController);
  server.use('/api/categories', categoriesController);
  server.use('/api/conditions', conditionsController);
  server.use('/api/tools', toolsController);
};
