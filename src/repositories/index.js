'use strict';

const TokensRepository = require('./TokensRepository');

// exports singleton instance of the Tokens Repository to be used across the service
// this instance uses the default value for the client (actual redis client)
module.exports = {
  tokensRepository: new TokensRepository(),
};
