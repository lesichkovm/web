function rtrim(str, charlist) {
  charlist = !charlist
    ? " \\s\u00A0"
    : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\\$1");
  var re = new RegExp("[" + charlist + "]+$", "g");
  return (str + "").replace(re, "");
}

function ltrim(str, charlist) {
  charlist = !charlist
    ? " \\s\u00A0"
    : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1");
  var re = new RegExp("^[" + charlist + "]+", "g");
  return (str + "").replace(re, "");
}

/**
 * Returns a unique identifier for the application
 * @returns {string}
 */
function getUniqueId() {
  return typeof APP_ID === "undefined"
    ? JSON.stringify(window.location.hostname)
    : APP_ID;
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rtrim, ltrim, getUniqueId };
}

// Export for browser global
if (typeof window !== 'undefined') {
  window.WebJS = window.WebJS || {};
  window.WebJS.utils = { rtrim, ltrim, getUniqueId };
}
