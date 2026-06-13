const { getUniqueId } = require('../../src/core/utils');

describe('Utils', () => {
  let originalAppId;

  beforeEach(() => {
    originalAppId = global.APP_ID;
  });

  afterEach(() => {
    if (originalAppId !== undefined) {
      global.APP_ID = originalAppId;
    } else {
      delete global.APP_ID;
    }
  });

  describe('getUniqueId', () => {
    it('should return the hostname as JSON string when APP_ID is not defined', () => {
      const id = getUniqueId();
      // JSDOM default is localhost
      expect(id).toBe(JSON.stringify('localhost'));
    });

    it('should return the APP_ID when it is defined', () => {
      global.APP_ID = 'my-custom-app';
      const id = getUniqueId();
      expect(id).toBe('my-custom-app');
    });
  });
});
