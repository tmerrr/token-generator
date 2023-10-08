'use strict';

const {
  createTokens
} = require('../controllers/tokens');
const { tokensRepository } = require('../../../src/repositories');

jest.mock('../../../src/repositories');

const hasUniqueValues = (arr) => new Set(arr).size === arr.length;

describe('Tokens Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTokens', () => {
    it('successfully creates and stores specified number of tokens', async () => {
      const mockDateNowValue = Date.now();
      jest.spyOn(Date, 'now').mockReturnValueOnce(mockDateNowValue);

      const numberOfTokens = 5;
      const result = createTokens(numberOfTokens);
      expect(result).toHaveLength(numberOfTokens);
      expect(hasUniqueValues(result)).toBe(true);
      expect(tokensRepository.saveToken).toHaveBeenCalledTimes(numberOfTokens);
      expect(tokensRepository.saveToken).toHaveBeenCalledWith({
        id: expect.any(String),
        isRedeemed: false,
        createdAt: mockDateNowValue,
        expiresAt: Date.now() + (10 * 24 * 60 * 60 * 1_000), // plus ten days
      });
    });
  });
});
