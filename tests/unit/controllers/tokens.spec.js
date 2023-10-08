'use strict';

const {
  createTokens,
  checkToken,
  redeemToken,
} = require('../../../src/controllers/tokens');
const {
  InvalidValuesError,
  TokenNotFoundError,
  TokenAlreadyRedeemedError,
  TokenExpiredError,
} = require('../../../src/errors');
const { tokensRepository } = require('../../../src/repositories');

jest.mock('../../../src/repositories');

const hasUniqueValues = (arr) => new Set(arr).size === arr.length;

describe('Tokens Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('createTokens', () => {
    it('successfully creates and stores specified number of tokens', async () => {
      const mockDateNowValue = Date.now();
      jest.spyOn(Date, 'now').mockReturnValueOnce(mockDateNowValue);

      const numberOfTokens = 5;
      const { created, tokens} = await createTokens(numberOfTokens);
      expect(created).toEqual(new Date(mockDateNowValue).toISOString());
      expect(tokens).toHaveLength(numberOfTokens);
      tokens.forEach((data) => {
        expect(data).toEqual(expect.any(String));
      });
      expect(hasUniqueValues(tokens)).toBe(true);
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(numberOfTokens);
      expect(tokensRepository.saveToken).toHaveBeenCalledWith({
        id: expect.any(String),
        isRedeemed: false,
        createdAt: mockDateNowValue,
        expiresAt: mockDateNowValue + (10 * 24 * 60 * 60 * 1_000), // plus ten days
      });
    });

    it('defaults to creating 1 token when no argument provided', async () => {
      const { tokens } = await createTokens();
      expect(tokens).toHaveLength(1);
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(1);
    });

    it('throws an InvalidValuesError when argument is less than 0', async () => {
      await expect(() => createTokens(-1))
        .rejects
        .toThrowError(new InvalidValuesError('Number of tokens must be greater than 0'));
    });
  });

  describe('checkToken', () => {
    it('returns the status "available" when token is not redeemed or expired', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5_000,
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      const { status } = await checkToken(tokenData.id);
      expect(status).toEqual('available');
    });

    it('returns the status "redeemed" when token has been redeemed', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: true,
        createdAt: Date.now(),
        expiresAt: Date.now(),
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      const { status } = await checkToken(tokenData.id);
      expect(status).toEqual('redeemed');
    });

    it('returns the status "expired" when token has is expired', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() - 1,
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      const { status } = await checkToken(tokenData.id);
      expect(status).toEqual('expired');
    });

    it('throws a TokenNotFoundError when the token does not exist', async () => {
      tokensRepository.getToken.mockResolvedValueOnce(null);
      const tokenId = 'tokenId';
      await expect(() => checkToken(tokenId))
        .rejects
        .toThrowError(new TokenNotFoundError(tokenId));
    });
  });

  describe('redeemToken', () => {
    it('returns the result "ok" and updates the token, when token is not redeemed or expired', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5_000,
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      const { result } = await redeemToken(tokenData.id);
      expect(result).toEqual('ok');
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(1);
      expect(tokensRepository.saveToken).toHaveBeenCalledWith({
        ...tokenData,
        isRedeemed: true,
      });
    });

    it('throws a TokenAlreadyRedeemedError when the token has been redeemed', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5_000,
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      await expect(() => redeemToken(tokenData.id))
        .rejects
        .toThrowError(new TokenAlreadyRedeemedError(tokenData.id));
    });

    it('throws a TokenExpiredError when the token has expired', async () => {
      const tokenData = {
        id: "tokenId",
        isRedeemed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() - 1,
      };
      tokensRepository.getToken.mockResolvedValueOnce(tokenData);
      await expect(() => redeemToken(tokenData.id))
        .rejects
        .toThrowError(new TokenExpiredError(tokenData.id));
    });

    it('throws a TokenNotFoundError when the token does not exist', async () => {
      tokensRepository.getToken.mockResolvedValueOnce(null);
      const tokenId = 'tokenId';
      await expect(() => redeemToken(tokenId))
        .rejects
        .toThrowError(new TokenNotFoundError(tokenId));
    });
  });
});
