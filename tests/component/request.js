'use strict';

const axios = require('axios');
const { TEST_URL } = require('../config');

const request = ({
  method,
  path,
  params,
  data,
  headers,
}) => axios({
  method,
  url: `${TEST_URL}${path}`,
  params,
  data,
  headers,
  // don't throw error on error status codes
  validateStatus: () => true,
});

module.exports = request;
