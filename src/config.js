'use strict';

module.exports = {
  port: process.env.PORT ?? 3000,
  cache: {
    host: process.env.CACHE_HOST ?? 'localhost',
    port: process.env.CACHE_PORT ?? 6379,
    password: process.env.CACHE_PASSWORD,
  },
};
