const { getRootUrl, getApiUrl, getUrl, getUrlParams, getUrlParam } = require('../../src/core/url');

describe('URL Utilities', () => {
  beforeEach(() => {
    // Clear any environment variables
    delete global.WEBSITE_URL;
    delete global.API_URL;
  });
  
  describe('getRootUrl', () => {
    it('should return the root URL (defaults to localhost in JSDOM)', () => {
       const rootUrl = getRootUrl();
       expect(rootUrl).toBe('http://localhost');
    });
    
    it('should use WEBSITE_URL environment variable when defined', () => {
      global.WEBSITE_URL = 'https://custom.example.com';
      const rootUrl = getRootUrl();
      expect(rootUrl).toBe('https://custom.example.com');
    });
  });
  
  describe('getApiUrl', () => {
    it('should return the API URL', () => {
       const apiUrl = getApiUrl();
       expect(apiUrl).toBe('http://localhost/api');
    });
    
    it('should use API_URL environment variable when defined', () => {
      global.API_URL = 'https://api.example.com/v1';
      const apiUrl = getApiUrl();
      expect(apiUrl).toBe('https://api.example.com/v1');
    });
  });

  describe('getUrl', () => {
    it('should return current URL', () => {
       expect(getUrl()).toBe('http://localhost/');
    });
  });

  describe('getUrlParams', () => {
    it('should return object with empty string key for localhost search "" (current implementation behavior)', () => {
       expect(getUrlParams()).toEqual({"": ""});
    });
  });
});
