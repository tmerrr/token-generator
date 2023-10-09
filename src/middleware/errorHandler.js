'use strict';

const { TOKEN_STATUSES } = require('../constants');
const {
  BaseError,
  InvalidValuesError,
  TokenNotFoundError,
  TokenAlreadyRedeemedError,
  TokenExpiredError,
} = require('../errors');

// default error handler middleware is responsible for checking errors thrown and mapping to desired response and status code
const errorHandler = () => (err, req, res, next) => {
  if (req.headersSent) {
    return next();
  }

  if (!(err instanceof BaseError)) {
    res.status(500).json({
      message: 'Internal Server Error',
      details: 'An unexpected error occurred',
    });
    return next();
  }

  const errResponse = {
    message: err.message,
    details: err.details,
    code: err.code,
  };

  if (err instanceof InvalidValuesError) {
    res.status(400).json(errResponse);
    res.status(400);
  } else if (err instanceof TokenNotFoundError) {
    res.status(404).json(errResponse);
    res.status(404);
  } else if (err instanceof TokenExpiredError) {
    res.status(410).json({ result: TOKEN_STATUSES.EXPIRED });
  } else if (err instanceof TokenAlreadyRedeemedError) {
    res.status(410).json({ result: TOKEN_STATUSES.REDEEMED });
  }

  return next();
};

module.exports = errorHandler;
