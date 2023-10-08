'use strict';

const errorHandler = require('./errorHandler');
const handleNotFound = require('./handleNotFound');
const wrapError = require('./wrapError');

module.exports = {
  errorHandler,
  handleNotFound,
  wrapError,
};
