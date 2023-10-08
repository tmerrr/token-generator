'use strict';

const express = require('express');
const routers = require('./routers');

const app = express();

app.use(express.json());

app.use('/healthcheck', routers.healthcheck)

module.exports = app;
