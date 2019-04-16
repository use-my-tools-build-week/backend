const authController = require('../api/controllers/auth');
const usersController = require('../api/controllers/users');
const categoriesController = require('../api/controllers/categories');
const conditionsController = require('../api/controllers/conditions');
const toolsController = require('../api/controllers/tools');
const loanRequestsController = require('../api/controllers/loan_requests');
const favoritesController = require('../api/controllers/favorites');
const reviewsController = require('../api/controllers/reviews');

module.exports = server => {
  server.use('/api', authController);
  server.use('/api/users', usersController);
  server.use('/api/categories', categoriesController);
  server.use('/api/conditions', conditionsController);
  server.use('/api/tools', toolsController);
  server.use('/api/loan_requests', loanRequestsController);
  server.use('/api/favorites', favoritesController);
  server.use('/api/reviews', reviewsController);
};
