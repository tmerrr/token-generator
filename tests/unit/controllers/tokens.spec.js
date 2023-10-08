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
      const result = await createTokens(numberOfTokens);
      expect(result).toHaveLength(numberOfTokens);
      result.forEach((data) => {
        expect(data).toEqual(expect.any(String));
      });
      expect(hasUniqueValues(result)).toBe(true);
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(numberOfTokens);
      expect(tokensRepository.saveToken).toHaveBeenCalledWith({
        id: expect.any(String),
        isRedeemed: false,
        createdAt: mockDateNowValue,
        expiresAt: mockDateNowValue + (10 * 24 * 60 * 60 * 1_000), // plus ten days
      });
    });

    it('defaults to creating 1 token when no argument provided', async () => {
      const result = await createTokens();
      expect(result).toHaveLength(1);
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(1);
    });

    it('throws an InvalidValuesError when argument is less than 0', async () => {
      expect(() => createTokens(-1)).toThrowError(new InvalidValuesError('Number of tokens must be greater than 0'));
    });
  });
});
