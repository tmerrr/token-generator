'use strict';

const TokensRepository = require('../../../src/repositories/tokens');

const mockRedisClient = {
  connect: jest.fn(),
  set: jest.fn(),
};

const tokensRepository = new TokensRepository(mockRedisClient);

describe('Tokens Repository', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveToken', () => {
    it('should store the token data correctly', async () => {
      const tokenData = {
        id: 'token-id',
        is_redeemed: false,
        createdAt: Date.now(),
      };
      await tokensRepository.saveToken(tokenData);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        tokenData.id,
        JSON.stringify(tokenData),
      );
    });
  });
});
