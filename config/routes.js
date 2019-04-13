const { authenticate } = require('../api/middleware/authenticate');
const authController = require('../api/controllers/auth');
const usersController = require('../api/controllers/users');

module.exports = server => {
  server.use('/api/users', usersController);
  server.use('/api', authController);
};
