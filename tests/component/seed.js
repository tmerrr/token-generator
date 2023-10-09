'use strict';

const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
  url: `redis://${config.cache.host}:${config.cache.port}`,
});

// set of helper functions to simplify seeding of token data in component tests
// means test files don't need to work with redis client directly and we changed storage system, would be easier to change as only this file needs changing
const connectClient = () => client.connect();
const disconnectClient = () => client.quit();
const seedToken = (tokenData) => client.set(tokenData.id, JSON.stringify(tokenData));
const teardownToken = (tokenId) => client.del(tokenId);

module.exports = {
  connectClient,
  disconnectClient,
  seedToken,
  teardownToken,
};
