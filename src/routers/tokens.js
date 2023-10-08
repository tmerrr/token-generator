'use strict';

const { Router } = require('express');
const { tokensController } = require('../controllers');
const { wrapError } = require('../middleware');

const router = Router();

router.post('/generate', wrapError(async (req, res, next) => {
  const {
    query: { tokens: numberOfTokens = 1 },
  } = req;
  const data = await tokensController.createTokens(parseInt(numberOfTokens, 10));
  res.status(200).json(data);
  return next();
}));

router.get('/check/:tokenId', wrapError(async (req, res, next) => {
  const {
    params: { tokenId },
  } = req;
  const data = await tokensController.checkToken(tokenId);
  res.status(200).json(data);
  return next();
}));

router.put('/redeem/:tokenId', wrapError(async (req, res, next) => {
  const {
    params: { tokenId },
  } = req;
  const data = await tokensController.redeemToken(tokenId);
  res.status(200).json(data);
  return next();
}));

module.exports = router;
