'use strict';

const { CacheConnectionError } = require('../../../src/errors');
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

  describe('init', () => {
    it('successfully connects to the cache', async () => {
      await tokensRepository.init();
      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
    });

    it('throws a CacheConnectionError when it fails to connect', async () => {
      const mockError = new Error('Connection failed');
      mockRedisClient.connect.mockRejectedValueOnce(mockError);
      await expect(() => tokensRepository.init())
        .rejects
        .toThrowError(new CacheConnectionError(mockError.message));
    });
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
