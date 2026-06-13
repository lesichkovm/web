const createNavigation = require('../../src/core/navigation');

describe('Navigation', () => {
  let navigation;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      getRootUrl: jest.fn().mockReturnValue('https://example.com')
    };
    navigation = createNavigation(mockConfig);

    // We mock window.open which is used for target: '_blank'
    window.open = jest.fn();
    
    // Clear document.body because it's used for target: '_blank' fallback in tests
    document.body.innerHTML = '';
  });

  describe('navigateTo', () => {
    it('should open URL in new tab when target is _blank', () => {
       const url = '/privacy';
       navigation.navigateTo(url, {}, { target: '_blank' });

       // The code for _blank actually does this in tests:
       // var div = document.createElement('div');
       // div.textContent = url;
       // document.body.appendChild(div);

       const div = document.body.querySelector('div');
       expect(div).not.toBeNull();
       expect(div.textContent).toBe('https://example.com/privacy');
    });

    it('should build correct URL with params for _blank', () => {
       const params = { id: '123' };
       navigation.navigateTo('/user', params, { target: '_blank' });

       const div = document.body.querySelector('div');
       expect(div.textContent).toBe('https://example.com/user?id=123');
    });
  });
});
