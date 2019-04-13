const express = require('express');
const server = express();
const configureCommonMiddleware = require('./middleware/common');

configureCommonMiddleware(server);

server.get('/', (req, res) => res.send('Api Running'));

module.exports = server;
