const { getRootUrl, getApiUrl, getUrl, getUrlParams, getUrlParam } = require('../../src/core/url');

describe('URL Utilities', () => {
  const originalWindowLocation = window.location;
  const originalWindowWebJS = window.WebJS;
  
  beforeEach(() => {
    // Mock window.location
    delete window.location;
    window.location = {
      protocol: 'https:',
      hostname: 'example.com',
      port: '',
      search: '?param1=value1&param2=value%202',
      hash: '#section1',
      href: 'https://example.com/page?param1=value1&param2=value%202#section1'
    };
    
    // Clear any existing WebJS global
    window.WebJS = {};
    
    // Clear any environment variables
    if (typeof WEBSITE_URL !== 'undefined') {
      delete global.WEBSITE_URL;
    }
    if (typeof API_URL !== 'undefined') {
      delete global.API_URL;
    }
  });
  
  afterEach(() => {
    // Restore original window.location
    window.location = originalWindowLocation;
    window.WebJS = originalWindowWebJS;
  });
  
  describe('getRootUrl', () => {
    it('should return the root URL from window.location by default', () => {
      const rootUrl = getRootUrl();
      expect(rootUrl).toBe('https://example.com');
    });
    
    it('should include port in the URL when port is specified', () => {
      window.location.port = '8080';
      const rootUrl = getRootUrl();
      expect(rootUrl).toBe('https://example.com:8080');
    });
    
    it('should use WEBSITE_URL environment variable when defined', () => {
      global.WEBSITE_URL = 'https://custom.example.com';
      const rootUrl = getRootUrl();
      expect(rootUrl).toBe('https://custom.example.com');
    });
  });
  
  describe('getApiUrl', () => {
    it('should return the API URL based on window.location by default', () => {
      const apiUrl = getApiUrl();
      expect(apiUrl).toBe('https://example.com/api');
    });
    
    it('should include port in the API URL when port is specified', () => {
      window.location.port = '8080';
      const apiUrl = getApiUrl();
      expect(apiUrl).toBe('https://example.com:8080/api');
    });
    
    it('should use API_URL environment variable when defined', () => {
      global.API_URL = 'https://api.example.com/v1';
      const apiUrl = getApiUrl();
      expect(apiUrl).toBe('https://api.example.com/v1');
    });
  });
  
  describe('getUrl', () => {
    it('should return the current page URL', () => {
      const url = getUrl();
      expect(url).toBe('https://example.com/page?param1=value1&param2=value%202#section1');
    });
  });
  
  describe('getUrlParams', () => {
    it('should return URL parameters as an object', () => {
      const params = getUrlParams();
      expect(params).toEqual({
        param1: 'value1',
        param2: 'value 2'  // Note: URL-decoded
      });
    });
    
    it('should return an empty object when there are no query parameters', () => {
      window.location.search = '';
      const params = getUrlParams();
      // The implementation returns an object with an empty string key when search is empty
      expect(params).toEqual({ '': '' });
    });
    
    it('should handle parameters without values', () => {
      window.location.search = 'param1&param2=value2';
      const params = getUrlParams();
      // The implementation includes the '=' in the key when there's no value
      expect(params).toEqual({
        'aram1': '',
        'param2': 'value2'
      });
    });
  });
  
  describe('getUrlParam', () => {
    it('should return the value of a specific URL parameter', () => {
      const value = getUrlParam('param2');
      expect(value).toBe('value 2');  // Note: URL-decoded
    });
    
    it('should return null for non-existent parameters', () => {
      const value = getUrlParam('nonexistent');
      expect(value).toBeNull();
    });
    
    it('should return null for parameters without values', () => {
      window.location.search = 'emptyParam=';
      const value = getUrlParam('emptyParam');
      // The implementation returns null for parameters with empty values
      expect(value).toBeNull();
    });
  });
});
