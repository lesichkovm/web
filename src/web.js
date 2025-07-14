// Import utility functions and modules
const { rtrim, ltrim, getUniqueId } = require('./core/utils');
const createPubSub = require('./core/pubsub');
const { getUrl, getUrlParams, getUrlParam, getRootUrl, getApiUrl } = require('./core/url');
const {
  getAuthUser,
  setAuthUser,
  getAuthToken,
  setAuthToken,
  getLanguage,
  setLanguage
} = require('./core/auth');
const createNavigation = require('./core/navigation');

// Configuration utilities - kept for backward compatibility
// but now delegates to the appropriate modules
function ConfigUtils() {
  this.getUniqueId = getUniqueId;
  this.getRootUrl = getRootUrl;
  this.getApiUrl = getApiUrl;
}

// Import the Registry from external package
// https://github.com/lesichkovm/registryjs
// https://www.npmjs.com/package/@lesichkovm/registryjs
const Registry = require('@lesichkovm/registryjs');

// Import loadWidgets
const { loadWidgets } = require('./loadWidgets');


/**
 * Main application class
 * @class Initialize
 * @type {$$
 */
class Initialize {
  constructor() {
    this.debug = true;
    
    // Initialize registry
    this.registry = new Registry(getUniqueId());
    
    // Initialize navigation with the root URL
    this.navigation = createNavigation({ getRootUrl });
    
    // Initialize pub/sub
    this.pubsub = createPubSub();
    
    // Initialize loadWidgets
    this.loadWidgets = loadWidgets;
  }

  /**
   * Retrieves a key value from the registry
   * @param {String} key
   * @returns {Object}
   */
  get(key) {
    return this.registry.get(key);
  }

  /**
   * Stores a key-value pair to the registry
   * @param {String} key
   * @param {Object} value
   * @returns {Object}
   */
  set(key, value) {
    return this.registry.set(key, value);
  }
  
  /**
   * Returns the API URL
   * If an API_URL variable is set, will return as it is. Otherwise will
   * generate one, assuming the API is hosted on the same domain {domain}/api
   * @returns {String}
   */
  getApiUrl() {
    return getApiUrl();
  }

  /**
   * Returns the current page URL
   * @returns {string}
   */
  getUrl() {
    return getUrl();
  }

  /**
   * Returns the URL parameters as an object
   * @returns {Object}
   */
  getUrlParams() {
    return getUrlParams();
  }

  /**
   * Returns a single URL parameter
   * @param {string} parameter - The parameter name to get
   * @returns {string|null}
   */
  getUrlParam(parameter) {
    return getUrlParam(parameter);
  }

  /**
   * Returns the authenticated user
   * @returns {Object|null} - The authenticated user or null if not authenticated
   */
  getAuthUser() {
    return getAuthUser(this.registry);
  }

  /**
   * Sets the authenticated user
   * @param {Object} user - The user object to set
   * @returns {Object} - The set user
   */
  setAuthUser(user) {
    return setAuthUser(user, this.registry);
  }

  /**
   * Returns the authentication token
   * @returns {string} - The authentication token
   */
  getAuthToken() {
    return getAuthToken(this.registry);
  }

  /**
   * Sets the authentication token
   * @param {string} token - The token to set
   * @returns {string} - The set token
   */
  setAuthToken(token) {
    return setAuthToken(token, this.registry);
  }
  
  /**
   * Returns the current language
   * @returns {string} - The current language code (default: 'en')
   */
  getLanguage() {
    return getLanguage(this.registry);
  }

  /**
   * Sets the current language
   * @param {string} language - The language code to set
   * @returns {string} - The set language code
   */
  setLanguage(language) {
    return setLanguage(language, this.registry);
  }

  /**
   * Redirects the user to the specified URL
   *
   * Options:
   * - target = _blank - will open a new window
   *
   * @param {string} url - The URL to navigate to
   * @param {Object} [data] - Query parameters to append to the URL
   * @param {Object} [options] - Navigation options
   * @param {string} [options.target] - The target for the navigation (e.g., '_blank')
   * @returns {boolean} - False to prevent default link behavior
   */
  to(url, data, options) {
    return this.navigation.navigateTo(url, data, options);
  }

  /**
   * Publishes an event to all subscribers
   * @param {string} event - The event name to publish
   * @param {*} data - The data to pass to subscribers
   */
  publish(event, data) {
    return this.pubsub.publish(event, data);
  }

  /**
   * Subscribes to an event
   * @param {string} event - The event name to subscribe to
   * @param {Function} callback - The function to call when the event is published
   * @returns {Function} - A function to unsubscribe
   */
  subscribe(event, callback) {
    return this.pubsub.subscribe(event, callback);
  }

  /**
   * Unsubscribes from an event
   * @param {string} event - The event name to unsubscribe from
   * @param {Function} callback - The function to remove from the subscribers list
   */
  unsubscribe(event, callback) {
    return this.pubsub.unsubscribe(event, callback);
  }
}

// Initialize components
$$ = new Initialize();

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = $$;
}

// Export for ES modules
if (typeof exports !== 'undefined') {
  exports.default = $$;
}

// Export for browser global
if (typeof window !== 'undefined') {
  window.WebJS = $$;
}
