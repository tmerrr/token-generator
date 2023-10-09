'use strict';

const axios = require('axios');
const { TEST_URL } = require('../config');

const METHOD = 'POST';
const ENDPOINT = '/tokens/generate';

describe(`${METHOD} ${ENDPOINT}`, () => {
  describe('when the request has valid values', () => {
    const numberOfTokens = 10;
    let response;
    beforeAll(async () => {
      response = await axios({
        method: METHOD,
        url: `${TEST_URL}${ENDPOINT}`,
        params: { tokens: numberOfTokens },
        // don't throw error on error status codes
        validateStatus: () => true,
      });
    });

    it('should return a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('created');
      expect(response.data).toHaveProperty('tokens');
    });

    it('should return the correct number of tokens', () => {
      expect(response.data.tokens).toHaveLength(numberOfTokens);
    });
  });

  describe('when the request has an invalid number of tokens', () => {
    const numberOfTokens = -1;
    let response;
    beforeAll(async () => {
      response = await axios({
        method: METHOD,
        url: `${TEST_URL}${ENDPOINT}`,
        params: { tokens: numberOfTokens },
        // don't throw error on error status codes
        validateStatus: () => true,
      });
    });

    it('should return a 400 status code', () => {
      expect(response.status).toEqual(400);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('details');
      expect(response.data).toHaveProperty('code');
    });

    it('should return the correct error code', () => {
      expect(response.data.code).toEqual('INVALID_VAL');
    });
  });
});
