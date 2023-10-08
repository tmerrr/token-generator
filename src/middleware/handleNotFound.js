'use strict';

// basic middleware just to override the default express behaviour of 404 errors
// normally returns HTML, wanted JSON response returned to keep consistent
const handleNotFound = () => (req, res, next) => {
  if (req.headersSent) {
    return next();
  }
  res.status(404).json({ message: 'Resource Not Found' });
};

module.exports = handleNotFound;
