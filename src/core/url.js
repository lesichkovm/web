/**
 * URL-related utility functions
 */

/**
 * Returns the root URL of the website
 * @returns {string}
 */
function getRootUrl() {
  return typeof WEBSITE_URL === "undefined"
    ? window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "")
    : WEBSITE_URL;
}

/**
 * Returns the API URL
 * @returns {string}
 */
function getApiUrl() {
  return typeof API_URL === "undefined"
    ? window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "") +
        "/api"
    : API_URL;
}

/**
 * Returns the current page URL
 * @returns {string}
 */
function getUrl() {
  return window.location.href;
}

/**
 * Returns the URL parameters as an object
 * @returns {Object}
 */
function getUrlParams() {
  const s = window.location.search.substring(1).split("&");
  const params = {};
  
  if (!s.length) {
    return params;
  }

  for (let i = 0; i < s.length; i++) {
    const parts = s[i].split("=");
    params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
  }

  return params;
}

/**
 * Returns a single URL parameter
 * @param {string} parameter - The parameter name to get
 * @returns {string|null}
 */
function getUrlParam(parameter) {
  const parameters = getUrlParams();
  return typeof parameters[parameter] === "undefined" 
    ? null 
    : parameters[parameter];
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getRootUrl,
    getApiUrl,
    getUrl,
    getUrlParams,
    getUrlParam
  };
}

// Export for browser global
if (typeof window !== 'undefined') {
  window.WebJS = window.WebJS || {};
  window.WebJS.URL = {
    getRootUrl,
    getApiUrl,
    getUrl,
    getUrlParams,
    getUrlParam
  };
}
