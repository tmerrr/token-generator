'use strict';

module.exports = {
  TEST_URL: process.env.TEST_URL ?? 'http://localhost:3000',
  cache: {
    host: process.env.CACHE_HOST ?? 'localhost',
    port: process.env.CACHE_PORT ?? 6379,
  },
};
