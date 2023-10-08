'use strict';

const redis = require('redis');
const config = require('../../config');

const redisClient = redis.createClient({
  host: config.cache.host,
  port: config.cache.port,
});

class TokensRepository {
  constructor(client = redisClient) {
    this.client = client;
  }

  async saveToken(tokenData) {
    await this.client.set(
      tokenData.id,
      JSON.stringify(tokenData),
    );
  }
}

module.exports = TokensRepository;
