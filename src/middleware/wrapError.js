'use strict';

const wrapError = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = wrapError;
