'use strict';

const crypto = require('crypto');
const { ONE_DAY } = require('../constants');
const { InvalidValuesError, TokenNotFoundError, TokenAlreadyRedeemedError, TokenExpiredError } = require('../errors');
const { tokensRepository } = require('../repositories');

const generateToken = (createdAt) => ({
  id: crypto.randomBytes(32).toString('hex'),
  isRedeemed: false,
  createdAt,
  expiresAt: createdAt + (10 * ONE_DAY),
});

const hasTokenExpired = (token) => token.expiresAt < Date.now();

const getTokenOrFail = async (tokenId) => {
  const token = await tokensRepository.getToken(tokenId);
  if (!token) {
    throw new TokenNotFoundError(tokenId);
  }
  return token;
};

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

const checkToken = async (tokenId) => {
  const token = await getTokenOrFail(tokenId);
  let status = 'available';
  if (token.isRedeemed) {
    status = 'redeemed';
  } else if (hasTokenExpired(token)) {
    status = 'expired';
  }

  return { status };
};

const redeemToken = async (tokenId) => {
  const token = await getTokenOrFail(tokenId);
  if (token.isRedeemed) {
    throw new TokenAlreadyRedeemedError(tokenId);
  }
  if (hasTokenExpired(token)) {
    throw new TokenExpiredError(tokenId);
  }
  await tokensRepository.saveToken({
    ...token,
    isRedeemed: true,
  });
  return { result: 'ok' };
};

module.exports = {
  createTokens,
  checkToken,
  redeemToken,
};
