'use strict';

const express = require('express');
const middleware = require('./middleware');
const routers = require('./routers');

const app = express();

app.use(express.json());

app.use('/healthcheck', routers.healthcheck)
app.use('/tokens', routers.tokens)

app.use(middleware.errorHandler());
app.use(middleware.handleNotFound());

module.exports = app;
