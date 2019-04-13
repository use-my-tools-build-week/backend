const { authenticate } = require('../api/middleware/authenticate');
const authController = require('../api/controllers/auth');

module.exports = server => {
  server.use('/api', authController);
};
