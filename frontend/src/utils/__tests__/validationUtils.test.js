import {
  isValidEmail,
  isRequired,
  isMinLength,
  isMaxLength,
  isNumberInRange,
  isUrl,
  hasUniqueValues,
  validateOptions
} from '../validationUtils';

describe('validationUtils', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('validates required string values', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired(' ')).toBe(false);
      expect(isRequired('')).toBe(false);
    });

    it('validates required array values', () => {
      expect(isRequired([1, 2, 3])).toBe(true);
      expect(isRequired([])).toBe(false);
    });

    it('validates required non-null values', () => {
      expect(isRequired(0)).toBe(true);
      expect(isRequired(false)).toBe(true);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('isMinLength', () => {
    it('validates minimum length', () => {
      expect(isMinLength('test', 3)).toBe(true);
      expect(isMinLength('test', 4)).toBe(true);
      expect(isMinLength('test', 5)).toBe(false);
    });
  });

  describe('isMaxLength', () => {
    it('validates maximum length', () => {
      expect(isMaxLength('test', 5)).toBe(true);
      expect(isMaxLength('test', 4)).toBe(true);
      expect(isMaxLength('test', 3)).toBe(false);
    });
  });

  describe('isNumberInRange', () => {
    it('validates numbers in range', () => {
      expect(isNumberInRange(5, 1, 10)).toBe(true);
      expect(isNumberInRange(1, 1, 10)).toBe(true);
      expect(isNumberInRange(10, 1, 10)).toBe(true);
      expect(isNumberInRange(0, 1, 10)).toBe(false);
      expect(isNumberInRange(11, 1, 10)).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('validates correct URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('hasUniqueValues', () => {
    it('validates unique values in array', () => {
      expect(hasUniqueValues([1, 2, 3])).toBe(true);
      expect(hasUniqueValues(['a', 'b', 'c'])).toBe(true);
      expect(hasUniqueValues([1, 2, 2])).toBe(false);
      expect(hasUniqueValues(['a', 'b', 'a'])).toBe(false);
    });

    it('handles case-insensitive string comparison', () => {
      expect(hasUniqueValues(['A', 'a', 'B'])).toBe(false);
      expect(hasUniqueValues(['A', 'B', 'C'])).toBe(true);
    });
  });

  describe('validateOptions', () => {
    it('validates correct options', () => {
      expect(validateOptions(['Option 1', 'Option 2'])).toBe(null);
      expect(validateOptions(['A', 'B', 'C', 'D'])).toBe(null);
    });

    it('rejects insufficient options', () => {
      expect(validateOptions(['Option 1'])).toBe('At least 2 options are required.');
      expect(validateOptions([])).toBe('At least 2 options are required.');
    });

    it('rejects empty options', () => {
      expect(validateOptions(['Option 1', ''])).toBe('All options must be filled.');
      expect(validateOptions(['Option 1', '   '])).toBe('All options must be filled.');
    });

    it('rejects duplicate options', () => {
      expect(validateOptions(['Option 1', 'Option 1'])).toBe('Duplicate options are not allowed.');
      expect(validateOptions(['A', 'B', 'A'])).toBe('Duplicate options are not allowed.');
    });
  });
});
