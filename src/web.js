// Import utility functions and modules
const { rtrim, ltrim } = require('./core/utils');
const createPubSub = require('./core/pubsub');
const { getUrl, getUrlParams, getUrlParam } = require('./core/url');
const {
  getAuthUser,
  setAuthUser,
  getAuthToken,
  setAuthToken,
  getLanguage,
  setLanguage
} = require('./core/auth');

// Config class
function Config() {
  this.getUniqueId = function () {
    return typeof APP_ID == "undefined"
      ? JSON.stringify(window.location.hostname)
      : APP_ID;
  };
  
  this.getRootUrl = function () {
    return typeof WEBSITE_URL == "undefined"
      ? window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + location.port : "")
      : WEBSITE_URL;
  };
  
  this.getApiUrl = function () {
    return typeof API_URL == "undefined"
      ? window.location.protocol +
          "//" +
          window.location.hostname +
          (location.port ? ":" + window.location.port : "") +
          "/api"
      : API_URL;
  };
}

// Import the Registry from external package
// https://github.com/lesichkovm/registryjs
// https://www.npmjs.com/package/@lesichkovm/registryjs


/**
 * Initialize
 * @type $$
 */
function Initialize() {
  /* START: Public Scope */
  this.debug = true;

  /**
   * Stores a key-value pair to the registry
   *
   * @param {String} key
   * @param {Object} value
   * @returns {Object}
   */
  this.get = function (key) {
    return Registry.get(key);
  };

  /**
   * Retrieves a key value from the registry
   *
   * @param {String} key
   * @returns {Object}
   */
  this.set = function (key, value) {
    return Registry.set(key, value);
  };
  
  /**
   * Returns the API URL
   * If an API_URL variable is set, will return as it is. Otherwise will
   * generate one, assuming the API is hosted on the same domain {domain}/api
   * @returns {String}
   */
  this.getApiUrl = function () {
    return Config.getApiUrl();
  };

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
    return getAuthUser(Registry);
  };

  /**
   * Sets the authenticated user
   * @param {Object} user - The user object to set
   * @returns {Object} - The set user
   */
  this.setAuthUser = function(user) {
    return setAuthUser(user, Registry);
  };

  /**
   * Returns the authentication token
   * @returns {string} - The authentication token
   */
  this.getAuthToken = function() {
    return getAuthToken(Registry);
  };

  /**
   * Sets the authentication token
   * @param {string} token - The token to set
   * @returns {string} - The set token
   */
  this.setAuthToken = function(token) {
    return setAuthToken(token, Registry);
  };
  
  /**
   * Returns the current language
   * @returns {string} - The current language code (default: 'en')
   */
  this.getLanguage = function() {
    return getLanguage(Registry);
  };

  /**
   * Sets the current language
   * @param {string} language - The language code to set
   * @returns {string} - The set language code
   */
  this.setLanguage = function(language) {
    return setLanguage(language, Registry);
  };

  /**
   * Redirects the user to the specified URL
   *
   * Options:
   * - target = _blank - will open a new window
   *
   * @param {*} url
   * @param {*} data
   * @param {*} options
   * @returns
   */
  this.to = function (url, data, options) {
    if (url.match("^http://") || url.match("^https://")) {
      // External url
    } else {
      var url = rtrim(Config.getRootUrl(), ["/"]) + "/" + ltrim(url, ["/"]);
    }

    var queryString =
      typeof data === "undefined"
        ? ""
        : Object.keys(data)
            .map((key) => {
              return (
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
              );
            })
            .join("&");

    if (queryString.length > 0) {
      url = url + (url.indexOf("?") < 0 ? "?" : "&") + queryString;
    }

    var options = typeof options === "undefined" ? {} : options;

    if (options.target === "_blank") {
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      document.body.lastElementChild.click();
    } else {
      window.location.href = url;
    }

    return false; // otherwise links will be triggered
  };

  // Initialize pub/sub
  const pubsub = createPubSub();
  
  // Expose pub/sub methods
  this.publish = pubsub.publish.bind(pubsub);
  this.subscribe = pubsub.subscribe.bind(pubsub);
  this.unsubscribe = pubsub.unsubscribe.bind(pubsub);

  // Utility functions are now imported from core/utils.js
}

// Import Registry from the external package
if (typeof require !== 'undefined') {
  // Node.js environment
  try {
    const RegistryJS = require('@lesichkovm/registryjs');
    Registry = RegistryJS;
  } catch (e) {
    console.error('Failed to load @lesichkovm/registryjs:', e);
  }
} else if (typeof window !== 'undefined' && window.Registry) {
  // Browser environment when loaded via script tag
  Registry = window.Registry;
} else if (typeof globalThis !== 'undefined' && globalThis.Registry) {
  // Support for modern environments
  Registry = globalThis.Registry;
} else {
  throw new Error('RegistryJS is required. Please include it before WebJS.');
}

// Initialize components
Config = new Config();
Registry = new Registry(Config.getUniqueId());
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
