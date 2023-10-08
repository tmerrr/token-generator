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

module.exports = {
  BaseError,
  CacheConnectionError,
};
