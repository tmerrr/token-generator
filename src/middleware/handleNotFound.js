'use strict';

const handleNotFound = () => (req, res, next) => {
  if (req.headersSent) {
    return next();
  }
  res.status(404).json({ message: 'Resource Not Found' });
};

module.exports = handleNotFound;
