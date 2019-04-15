const express = require('express');
const server = express();
const configureCommonMiddleware = require('./middleware/common');
const configureRoutes = require('../config/routes');

configureCommonMiddleware(server);
configureRoutes(server);

server.get('/', (req, res) => res.send('Api Running'));

module.exports = server;
