function createPubSub() {
  const topics = {};
  let subUid = -1;

  return {
    /**
     * Publish a message to a topic
     * @param {string} topic - The topic to publish to
     * @param {*} args - Data to pass to subscribers
     * @returns {boolean} - True if there were subscribers, false otherwise
     */
    publish(topic, args) {
      if (!topics[topic]) {
        return false;
      }

      setTimeout(() => {
        const subscribers = topics[topic];
        let len = subscribers ? subscribers.length : 0;

        while (len--) {
          subscribers[len].func(topic, args);
        }
      }, 0);

      return true;
    },

    /**
     * Subscribe to a topic
     * @param {string} topic - The topic to subscribe to
     * @param {Function} func - The function to call when a message is published
     * @returns {string} - A token that can be used to unsubscribe
     */
    subscribe(topic, func) {
      if (!topics[topic]) {
        topics[topic] = [];
      }

      const token = (++subUid).toString();
      topics[topic].push({
        token,
        func,
      });
      return token;
    },

    /**
     * Unsubscribe from a topic
     * @param {string} token - The subscription token to remove
     * @returns {string|boolean} - The token if unsubscribed, false otherwise
     */
    unsubscribe(token) {
      for (const m in topics) {
        if (topics[m]) {
          for (let i = 0, j = topics[m].length; i < j; i++) {
            if (topics[m][i].token === token) {
              topics[m].splice(i, 1);
              return token;
            }
          }
        }
      }
      return false;
    }
  };
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createPubSub;
}
