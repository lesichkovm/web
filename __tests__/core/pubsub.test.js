const createPubSub = require('../../src/core/pubsub');

describe('PubSub', () => {
  let pubsub;
  
  beforeEach(() => {
    // Mock timers
    jest.useFakeTimers();
    
    // Create a new PubSub instance before each test
    pubsub = createPubSub();
  });
  
  afterEach(() => {
    // Restore timers
    jest.useRealTimers();
  });

  describe('subscribe and publish', () => {
    it('should call the callback when a message is published to a topic', () => {
      // Create a mock callback
      const mockCallback = jest.fn();
      
      // Subscribe to a topic
      const token = pubsub.subscribe('test.topic', mockCallback);
      
      // Publish a message
      const message = { data: 'test message' };
      const result = pubsub.publish('test.topic', message);
      
      // Fast-forward timers to execute the setTimeout
      jest.runAllTimers();
      
      // Verify the callback was called with the correct arguments
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('test.topic', message);
      
      // Publish should return true when there are subscribers
      expect(result).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    it('should remove a subscription when unsubscribed', () => {
      // Create a mock callback
      const mockCallback = jest.fn();
      
      // Subscribe and get the token
      const token = pubsub.subscribe('test.topic', mockCallback);
      
      // Unsubscribe
      const result = pubsub.unsubscribe(token);
      
      // Publish a message
      pubsub.publish('test.topic', { data: 'test' });
      
      // Fast-forward timers to execute the setTimeout
      jest.runAllTimers();
      
      // Verify the callback was not called
      expect(mockCallback).not.toHaveBeenCalled();
      
      // Should return the token on successful unsubscribe
      expect(result).toBe(token);
    });
  });
});
