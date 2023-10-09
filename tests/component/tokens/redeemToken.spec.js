'use strict';

const request = require('../request');
const {
  connectClient,
  disconnectClient,
  seedToken,
  teardownToken,
} = require('../seed');

const METHOD = 'PUT';
const endpointById = (tokenId) => `/tokens/redeem/${tokenId}`

describe(`${METHOD} ${endpointById(':tokenId')}`, () => {
  beforeAll(async () => {
    await connectClient();
  });

  afterAll(async () => {
    await disconnectClient();
  });

  describe('when the token is available', () => {
    const tokenData = {
      id: '063c034a-4b74-4f3e-8080-3d9cd87d1cc3',
      isRedeemed: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10_000, // in 10 seconds time
    };
    let response;
    beforeAll(async () => {
      await seedToken(tokenData);
      response = await request({
        method: METHOD,
        path: endpointById(tokenData.id),
      });
    });

    afterAll(async () => {
      await teardownToken(tokenData.id);
    });

    it('should return a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('result');
    });

    it('should have the expected result', () => {
      expect(response.data.result).toEqual('ok');
    });
  });

  describe('when the token is expired', () => {
    const tokenData = {
      id: '3f6666b5-c5ae-4fbd-ba69-60c33f806d1e',
      isRedeemed: false,
      createdAt: Date.now(),
      expiresAt: Date.now() - 10_000, // 10 seconds ago
    };
    let response;
    beforeAll(async () => {
      await seedToken(tokenData);
      response = await request({
        method: METHOD,
        path: endpointById(tokenData.id),
      });
    });

    afterAll(async () => {
      await teardownToken(tokenData.id);
    });

    it('should return a 410 status code', () => {
      expect(response.status).toEqual(410);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('result');
    });

    it('should have the expected result', () => {
      expect(response.data.result).toEqual('expired');
    });
  });

  describe('when the token is already redeemed', () => {
    const tokenData = {
      id: 'e0772cec-e831-4acd-889c-28f01e24c7ae',
      isRedeemed: true,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10_000, // in 10 seconds time
    };
    let response;
    beforeAll(async () => {
      await seedToken(tokenData);
      response = await request({
        method: METHOD,
        path: endpointById(tokenData.id),
      });
    });

    afterAll(async () => {
      await teardownToken(tokenData.id);
    });

    it('should return a 410 status code', () => {
      expect(response.status).toEqual(410);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('result');
    });

    it('should have the expected result', () => {
      expect(response.data.result).toEqual('redeemed');
    });
  });

  describe('when the token is not found', () => {
    let response;
    beforeAll(async () => {
      response = await request({
        method: METHOD,
        path: endpointById('4f149726-a127-4fc3-9927-4a56f4ba7d6d'),
      });
    });

    it('should return a 404 status code', () => {
      expect(response.status).toEqual(404);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('details');
      expect(response.data).toHaveProperty('code');
    });

    it('should have the expected error code', () => {
      expect(response.data.code).toEqual('TKN_NOT_FOUND');
    });
  });
});
