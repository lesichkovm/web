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


/**
 * Initialize
 * @type $$
 */
function Initialize() {
  this.debug = true;

  /**
   * Stores a key-value pair to the registry
   *
   * @param {String} key
   * @param {Object} value
   * @returns {Object}
   */
  this.get = function (key) {
    return this.registry.get(key);
  };

  /**
   * Retrieves a key value from the registry
   *
   * @param {String} key
   * @returns {Object}
   */
  this.set = function (key, value) {
    return this.registry.set(key, value);
  };
  
  /**
   * Returns the API URL
   * If an API_URL variable is set, will return as it is. Otherwise will
   * generate one, assuming the API is hosted on the same domain {domain}/api
   * @returns {String}
   */
  this.getApiUrl = getApiUrl;

  /**
   * Returns the current page URL
   * @returns {string}
   */
  this.getUrl = getUrl;

  /**
   * Returns the URL parameters as an object
   * @returns {Object}
   */
  this.getUrlParams = getUrlParams;

  /**
   * Returns a single URL parameter
   * @param {string} parameter - The parameter name to get
   * @returns {string|null}
   */
  this.getUrlParam = getUrlParam;

  /**
   * Returns the authenticated user
   * @returns {Object|null} - The authenticated user or null if not authenticated
   */
  this.getAuthUser = function() {
    return getAuthUser(this.registry);
  };

  /**
   * Sets the authenticated user
   * @param {Object} user - The user object to set
   * @returns {Object} - The set user
   */
  this.setAuthUser = function(user) {
    return setAuthUser(user, this.registry);
  };

  /**
   * Returns the authentication token
   * @returns {string} - The authentication token
   */
  this.getAuthToken = function() {
    return getAuthToken(this.registry);
  };

  /**
   * Sets the authentication token
   * @param {string} token - The token to set
   * @returns {string} - The set token
   */
  this.setAuthToken = function(token) {
    return setAuthToken(token, this.registry);
  };
  
  /**
   * Returns the current language
   * @returns {string} - The current language code (default: 'en')
   */
  this.getLanguage = function() {
    return getLanguage(this.registry);
  };

  /**
   * Sets the current language
   * @param {string} language - The language code to set
   * @returns {string} - The set language code
   */
  this.setLanguage = function(language) {
    return setLanguage(language, this.registry);
  };

  // Initialize navigation with the root URL
  const navigation = createNavigation({ getRootUrl });
  
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
  this.to = function(url, data, options) {
    return navigation.navigateTo(url, data, options);
  };

  // Initialize pub/sub
  const pubsub = createPubSub();
  
  // Expose pub/sub methods
  this.publish = pubsub.publish.bind(pubsub);
  this.subscribe = pubsub.subscribe.bind(pubsub);
  this.unsubscribe = pubsub.unsubscribe.bind(pubsub);

  // Initialize registry
  const Registry = require('@lesichkovm/registryjs');
  this.registry = new Registry(getUniqueId());
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
