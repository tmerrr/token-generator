'use strict';

const crypto = require('crypto');
const { ONE_DAY } = require('../constants');
const { tokensRepository } = require('../repositories');

const generateToken = (createdAt) => ({
  id: crypto.randomBytes(32).toString('hex'),
  isRedeemed: false,
  createdAt,
  expiresAt: createdAt + (10 * ONE_DAY),
});

const createTokens = (numberOfTokens) => {
  const createdAt = Date.now();
  const tokens = new Array(numberOfTokens)
    .fill()
    .map(() => generateToken(createdAt));

  return tokens.reduce(async (tokenIdsPromise, token) => {
    const tokenIds = await tokenIdsPromise;
    await tokensRepository.saveToken(token);
    tokenIds.push(token.id);
    return tokenIds;
  }, []);
};

module.exports = {
  createTokens,
};
