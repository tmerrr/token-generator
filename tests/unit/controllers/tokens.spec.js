'use strict';

const {
  createTokens,
} = require('../../../src/controllers/tokens');
const { InvalidValuesError } = require('../../../src/errors');
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
});
