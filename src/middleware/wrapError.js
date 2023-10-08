'use strict';

// used in routers to ensure any errors are correctly handled and passed to the default error handler middleware
const wrapError = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = wrapError;
