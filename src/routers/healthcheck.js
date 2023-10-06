'use strict';

const { Router } = require('express');

const router = Router();

router.get('/ping', (req, res, next) => {
  res.status(200).json({ message: 'OK' });
  return next();
});

module.exports = router;
