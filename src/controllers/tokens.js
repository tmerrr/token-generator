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

const createTokens = async (numberOfTokens = 1) => {
  if (numberOfTokens < 0) {
    throw new InvalidValuesError('Number of tokens must be greater than 0')
  }
  const createdAt = Date.now();
  const tokens = new Array(numberOfTokens)
    .fill()
    .map(() => generateToken(createdAt));

  const tokenIds = await tokens.reduce(async (accPromise, token) => {
    const acc = await accPromise;
    await tokensRepository.saveToken(token);
    acc.push(token.id);
    return acc;
  }, []);

  return {
    created: new Date(createdAt).toISOString(),
    tokens: tokenIds,
  };
};

module.exports = {
  createTokens,
};
