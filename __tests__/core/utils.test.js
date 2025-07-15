const { rtrim, ltrim, getUniqueId } = require('../../src/core/utils');

describe('Utils', () => {
  const originalWindowLocation = window.location;
  const originalAppId = global.APP_ID;
  
  beforeEach(() => {
    // Mock window.location for getUniqueId tests
    delete window.location;
    window.location = {
      hostname: 'example.com'
    };
    
    // Clear APP_ID before each test
    if (typeof global.APP_ID !== 'undefined') {
      delete global.APP_ID;
    }
  });
  
  afterEach(() => {
    // Restore original window.location
    window.location = originalWindowLocation;
    
    // Restore original APP_ID
    if (originalAppId !== undefined) {
      global.APP_ID = originalAppId;
    } else {
      delete global.APP_ID;
    }
  });
  
  describe('rtrim', () => {
    it('should trim whitespace from the right side by default', () => {
      expect(rtrim('  test  ')).toBe('  test');
      expect(rtrim('test\t\n')).toBe('test');
      expect(rtrim('test\u00A0')).toBe('test'); // Non-breaking space
    });
    
    it('should trim specified characters from the right side', () => {
      expect(rtrim('test...', '.')).toBe('test');
      expect(rtrim('test123', '0-9')).toBe('test');
      expect(rtrim('test***', '*')).toBe('test');
    });
    
    it('should handle special regex characters in charlist', () => {
      expect(rtrim('test*+?^$.', '*+?^$.')).toBe('test');
    });
    
    it('should handle empty string input', () => {
      expect(rtrim('')).toBe('');
    });
    
    it('should convert non-string input to string', () => {
      expect(rtrim(123)).toBe('123');
      expect(rtrim(null)).toBe('null');
      expect(rtrim(undefined)).toBe('undefined');
    });
  });
  
  describe('ltrim', () => {
    it('should trim whitespace from the left side by default', () => {
      expect(ltrim('  test  ')).toBe('test  ');
      expect(ltrim('\t\ntest')).toBe('test');
      expect(ltrim('\u00A0test')).toBe('test'); // Non-breaking space
    });
    
    it('should trim specified characters from the left side', () => {
      expect(ltrim('...test', '.')).toBe('test');
      expect(ltrim('123test', '0-9')).toBe('test');
      expect(ltrim('***test', '*')).toBe('test');
    });
    
    it('should handle special regex characters in charlist', () => {
      expect(ltrim('*+?^$.test', '*+?^$.')).toBe('test');
    });
    
    it('should handle empty string input', () => {
      expect(ltrim('')).toBe('');
    });
    
    it('should convert non-string input to string', () => {
      expect(ltrim(123)).toBe('123');
      expect(ltrim(null)).toBe('null');
      expect(ltrim(undefined)).toBe('undefined');
    });
  });
  
  describe('getUniqueId', () => {
    it('should return the hostname as JSON string when APP_ID is not defined', () => {
      const id = getUniqueId();
      expect(id).toBe(JSON.stringify('example.com'));
    });
    
    it('should return the APP_ID when it is defined', () => {
      global.APP_ID = 'custom-app-id';
      const id = getUniqueId();
      expect(id).toBe('custom-app-id');
    });
    
    it('should handle different window.location.hostname values', () => {
      window.location.hostname = 'subdomain.example.org';
      expect(getUniqueId()).toBe(JSON.stringify('subdomain.example.org'));
      
      window.location.hostname = 'localhost';
      expect(getUniqueId()).toBe(JSON.stringify('localhost'));
    });
  });
});
