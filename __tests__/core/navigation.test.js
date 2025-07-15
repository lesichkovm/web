const createNavigation = require('../../src/core/navigation');

describe('Navigation', () => {
  let navigation;
  let mockConfig;
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Mock the config with getRootUrl method
    mockConfig = {
      getRootUrl: jest.fn().mockReturnValue('https://example.com')
    };

    // Create navigation instance
    navigation = createNavigation(mockConfig);

    // Mock window.location
    delete window.location;
    window.location = {
      href: 'https://example.com',
      protocol: 'https:',
      hostname: 'example.com',
      port: '',
      search: '',
      hash: ''
    };

    // Mock window.open
    window.open = jest.fn();
    
    // Clear the document body
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Restore window.location
    window.location = originalWindowLocation;
  });

  describe('navigateTo', () => {
    it('should navigate to an internal URL', () => {
      const preventDefault = jest.fn();
      
      const result = navigation.navigateTo('/dashboard');
      
      expect(result).toBe(false);
      expect(window.location.href).toBe('https://example.com/dashboard');
    });

    it('should navigate to an external URL', () => {
      const externalUrl = 'https://external.com/page';
      
      navigation.navigateTo(externalUrl);
      
      expect(window.location.href).toBe(externalUrl);
    });

    it('should add query parameters to the URL', () => {
      const params = { id: '123', tab: 'settings' };
      
      navigation.navigateTo('/user', params);
      
      expect(window.location.href).toContain('https://example.com/user?');
      expect(window.location.href).toContain('id=123');
      expect(window.location.href).toContain('tab=settings');
    });

    it('should open URL in new tab when target is _blank', () => {
      const url = '/privacy';
      
      navigation.navigateTo(url, {}, { target: '_blank' });
      
      // In test environment, it adds the URL to document body
      const div = document.body.firstChild;
      expect(div).not.toBeNull();
      expect(div.textContent).toBe('https://example.com/privacy');
    });

    it('should handle URLs with existing query parameters', () => {
      const url = '/search?q=test';
      const params = { page: '2', sort: 'desc' };
      
      navigation.navigateTo(url, params);
      
      expect(window.location.href).toContain('https://example.com/search?q=test&');
      expect(window.location.href).toContain('page=2');
      expect(window.location.href).toContain('sort=desc');
    });
  });
});
