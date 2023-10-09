'use strict';

const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
  url: `redis://${config.cache.host}:${config.cache.port}`,
});

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
