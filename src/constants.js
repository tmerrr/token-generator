'use strict';

const { name } = require('../package.json');

module.exports = {
  SERVICE_NAME: name,
  ONE_DAY: 24 * 60 * 60 * 1_000,
  TOKEN_STATUSES: {
    AVAILABLE: 'available',
    REDEEMED: 'redeemed',
    EXPIRED: 'expired',
  },
};
