'use strict';

// basic middleware just to override the default express behaviour of 404 errors
// normally returns HTML, wanted JSON response returned to keep consistent
const handleNotFound = () => (req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Resource Not Found' });
  }
  return next();
};

module.exports = handleNotFound;
