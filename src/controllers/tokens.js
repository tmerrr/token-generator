'use strict';

const crypto = require('crypto');
const { ONE_DAY } = require('../constants');
const { InvalidValuesError } = require('../errors');
const { tokensRepository } = require('../repositories');

const generateToken = (createdAt) => ({
  id: crypto.randomBytes(32).toString('hex'),
  isRedeemed: false,
  createdAt,
  expiresAt: createdAt + (10 * ONE_DAY),
});

const createTokens = (numberOfTokens = 1) => {
  if (numberOfTokens < 0) {
    throw new InvalidValuesError('Number of tokens must be greater than 0')
  }
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
