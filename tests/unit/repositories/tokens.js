'use strict';

const { CacheConnectionError } = require('../../../src/errors');
const TokensRepository = require('../../../src/repositories/tokens');

const mockRedisClient = {
  connect: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
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
        isRedeemed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1_000), // plus one day
      };
      await tokensRepository.saveToken(tokenData);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        tokenData.id,
        JSON.stringify(tokenData),
      );
    });
  });

  describe('getToken', () => {
    it('should return token data when found', async () => {
      const tokenData = {
        id: 'token-id',
        isRedeemed: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1_000), // plus one day
      };
      mockRedisClient.get.mockResolvedValueOnce(JSON.stringify(tokenData));
      const result = await tokensRepository.getToken(tokenData.id);
      expect(result).toEqual(tokenData);
      expect(mockRedisClient.get).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.get).toHaveBeenCalledWith(tokenData.id);
    });

    it('should return null when token not found', async () => {
      mockRedisClient.get.mockResolvedValueOnce(null);
      const result = await tokensRepository.getToken('id');
      expect(result).toBeNull();
    });
  });
});
