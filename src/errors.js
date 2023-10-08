'use strict';

// purpose of this file is to create bespoke errors specific to certain use cases
// each error will have a unique code

class BaseError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

class CacheConnectionError extends BaseError {
  constructor(details) {
    super(
      'Failed to connect to cache',
      'CACHE_CONN_ERR',
      details,
    );
  }
}

class InvalidValuesError extends BaseError {
  constructor(details) {
    super(
      'Invalid data provided',
      'INVALID_VAL',
      details,
    );
  }
}

class TokenNotFoundError extends BaseError {
  constructor(tokenId) {
    super(
      'Token not found',
      'TKN_NOT_FOUND',
      `Token with Id: ${tokenId} was not found`,
    );
  }
}

class TokenAlreadyRedeemedError extends BaseError {
  constructor(tokenId) {
    super(
      'Token has already been redeemed',
      'TKN_REDEEMED',
      `Token with Id: ${tokenId} has already been redeemed`,
    );
  }
}
class TokenExpiredError extends BaseError {
  constructor(tokenId) {
    super(
      'Token has expired',
      'TKN_EXPIRED',
      `Token with Id: ${tokenId} has expired and cannot be redeemed`,
    );
  }
}

module.exports = {
  BaseError,
  CacheConnectionError,
  InvalidValuesError,
  TokenNotFoundError,
  TokenAlreadyRedeemedError,
  TokenExpiredError,
};
