'use strict';

const redis = require('redis');
const config = require('../config');
const { CacheConnectionError } = require('../errors');

const redisClient = redis.createClient({
  url: `redis://${config.cache.host}:${config.cache.port}`,
});

// the repository abstracts the internal interface of the redis cache / client
// client is injected so that it can be replaced by another storage tool
// if replaced by something else (such as a DB) there will be no need to change the interface of this class
class TokensRepository {
  constructor(client = redisClient) {
    this.client = client;
  }

  async init() {
    try {
      await this.client.connect();
    } catch (err) {
      throw new CacheConnectionError(err.message);
    }
  }

  // TS would be preferred to ensure tokenData has correct attributes
  // this function acts as an upsert, so will overwrite data if the key already exists
  // improvement would be to have clearer separation, one to save a new token and another to update existing value
  async saveToken(tokenData) {
    await this.client.set(
      tokenData.id,
      JSON.stringify(tokenData),
    );
  }

  async getToken(tokenId) {
    const tokenData = await this.client.get(tokenId);
    if (tokenData) {
      return JSON.parse(tokenData);
    }
    return null;
  }
}

module.exports = TokensRepository;
