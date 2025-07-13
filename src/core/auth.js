/**
 * Authentication-related utility functions
 */

/**
 * Returns the authenticated user
 * @returns {Object|null} - The authenticated user or null if not authenticated
 */
function getAuthUser(registry) {
  return registry.get("AuthUser");
}

/**
 * Sets the authenticated user
 * @param {Object} user - The user object to set
 * @param {Object} registry - The registry instance to use
 * @returns {Object} - The set user
 */
function setAuthUser(user, registry) {
  return registry.set("AuthUser", user);
}

/**
 * Returns the authentication token
 * @param {Object} registry - The registry instance to use
 * @returns {string} - The authentication token
 */
function getAuthToken(registry) {
  return registry.get("AuthToken");
}

/**
 * Sets the authentication token
 * @param {string} token - The token to set
 * @param {Object} registry - The registry instance to use
 * @returns {string} - The set token
 */
function setAuthToken(token, registry) {
  return registry.set("AuthToken", token);
}

/**
 * Returns the current language
 * @param {Object} registry - The registry instance to use
 * @returns {string} - The current language code (default: 'en')
 */
function getLanguage(registry) {
  const language = registry.get("CurrentLanguage");
  return language === null ? "en" : language;
}

/**
 * Sets the current language
 * @param {string} language - The language code to set
 * @param {Object} registry - The registry instance to use
 * @returns {string} - The set language code
 */
function setLanguage(language, registry) {
  return registry.set("CurrentLanguage", language);
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAuthUser,
    setAuthUser,
    getAuthToken,
    setAuthToken,
    getLanguage,
    setLanguage
  };
}

// Export for browser global
if (typeof window !== 'undefined') {
  window.WebJS = window.WebJS || {};
  window.WebJS.Auth = {
    getAuthUser: (registry) => getAuthUser(registry),
    setAuthUser: (user, registry) => setAuthUser(user, registry),
    getAuthToken: (registry) => getAuthToken(registry),
    setAuthToken: (token, registry) => setAuthToken(token, registry),
    getLanguage: (registry) => getLanguage(registry),
    setLanguage: (language, registry) => setLanguage(language, registry)
  };
}
