const { getAuthUser, setAuthUser, getAuthToken, setAuthToken, getLanguage, setLanguage } = require('../../src/core/auth');

describe('Auth', () => {
  let mockRegistry;

  beforeEach(() => {
    // Create a mock registry with get/set methods
    mockRegistry = {
      data: {},
      get: jest.fn((key) => mockRegistry.data[key] ?? null),
      set: jest.fn((key, value) => {
        mockRegistry.data[key] = value;
        return value;
      })
    };
  });

  describe('getAuthUser', () => {
    it('should return the authenticated user', () => {
      const mockUser = { id: 1, name: 'Test User' };
      mockRegistry.data.AuthUser = mockUser;
      
      const result = getAuthUser(mockRegistry);
      
      expect(mockRegistry.get).toHaveBeenCalledWith('AuthUser');
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is authenticated', () => {
      const result = getAuthUser(mockRegistry);
      expect(result).toBeNull();
    });
  });

  describe('setAuthUser', () => {
    it('should set the authenticated user', () => {
      const mockUser = { id: 1, name: 'Test User' };
      
      const result = setAuthUser(mockUser, mockRegistry);
      
      expect(mockRegistry.set).toHaveBeenCalledWith('AuthUser', mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAuthToken', () => {
    it('should return the authentication token', () => {
      const mockToken = 'test-token';
      mockRegistry.data.AuthToken = mockToken;
      
      const result = getAuthToken(mockRegistry);
      
      expect(mockRegistry.get).toHaveBeenCalledWith('AuthToken');
      expect(result).toBe(mockToken);
    });
  });

  describe('setAuthToken', () => {
    it('should set the authentication token', () => {
      const mockToken = 'test-token';
      
      const result = setAuthToken(mockToken, mockRegistry);
      
      expect(mockRegistry.set).toHaveBeenCalledWith('AuthToken', mockToken);
      expect(result).toBe(mockToken);
    });
  });

  describe('getLanguage', () => {
    it('should return the current language', () => {
      const mockLanguage = 'fr';
      mockRegistry.data.CurrentLanguage = mockLanguage;
      
      const result = getLanguage(mockRegistry);
      
      expect(mockRegistry.get).toHaveBeenCalledWith('CurrentLanguage');
      expect(result).toBe(mockLanguage);
    });

    it('should return "en" as default language when not set', () => {
      const result = getLanguage(mockRegistry);
      expect(result).toBe('en');
    });
  });

  describe('setLanguage', () => {
    it('should set the current language', () => {
      const mockLanguage = 'es';
      
      const result = setLanguage(mockLanguage, mockRegistry);
      
      expect(mockRegistry.set).toHaveBeenCalledWith('CurrentLanguage', mockLanguage);
      expect(result).toBe(mockLanguage);
    });
  });
});
