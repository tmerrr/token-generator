'use strict';

const request = require('../request');
const {
  connectClient,
  disconnectClient,
  seedToken,
  teardownToken,
} = require('../seed');

const METHOD = 'GET';
const endpointById = (tokenId) => `/tokens/check/${tokenId}`

describe(`${METHOD} ${endpointById(':tokenId')}`, () => {
  beforeAll(async () => {
    await connectClient();
  });

  afterAll(async () => {
    await disconnectClient();
  });

  describe('when the token is available', () => {
    const tokenData = {
      id: '0ac0aec7-0514-4438-b920-b4c736930fc3',
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
      expect(response.data).toHaveProperty('status');
    });

    it('should have the expected status', () => {
      expect(response.data.status).toEqual('available');
    });
  });

  describe('when the token is expired', () => {
    const tokenData = {
      id: '1e07d88a-6c8b-4d65-b542-5730501cf0b9',
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

    it('should return a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('status');
    });

    it('should have the expected status', () => {
      expect(response.data.status).toEqual('expired');
    });
  });

  describe('when the token is already redeemed', () => {
    const tokenData = {
      id: 'ec7da178-1e2a-4852-8396-bc188299f9a8',
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

    it('should return a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should have the expected properties', () => {
      expect(response.data).toHaveProperty('status');
    });

    it('should have the expected status', () => {
      expect(response.data.status).toEqual('redeemed');
    });
  });

  describe('when the token is not found', () => {
    let response;
    beforeAll(async () => {
      response = await request({
        method: METHOD,
        path: endpointById('6b1b99a1-da2c-41fd-91a0-b1a8c26d9e8b'),
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
