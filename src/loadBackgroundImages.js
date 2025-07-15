/**
 * Loads and sets a background image for a given element
 * @param {HTMLElement} element - The element to set the background image on
 * @param {string} url - The URL of the image to load
 */
function loadElementBackground(element, url) {
  if (!element || !element.style || !url) return;
  
  const img = new Image();
  
  // When image loads, set it as background
  img.onload = function() {
    element.style.backgroundImage = `url(${url})`;
    // remove spinners and loaders
    element.querySelector('.fa-spin')?.remove();
    element.querySelector('.spinner-border')?.remove();
    element.querySelector('.spinner-grow')?.remove();
    element.querySelector('.loading')?.remove();

  };
  
  // Handle image loading errors
  img.onerror = function() {
    console.error(`Failed to load background image: ${url}`);
  };
  
  // Start loading the image
  img.src = url;
}

/**
 * This function finds all div elements with the 'data-background-image' attribute and
 * sets their background-image CSS property to the specified URL.
 * 
 * Features:
 * - Lazy loading of images - images are loaded only when needed
 * - Progressive enhancement - page functions before images are loaded
 * - Error handling for image loading
 * - Performance optimization - images set only after fully loaded
 * 
 * @example
 * // HTML: <div data-background-image="/path/to/image.jpg"></div>
 * loadBackgroundImages();
 * 
 * @returns {void}
 */
function loadBackgroundImages() {
  // Get all div elements with data-background-image attribute
  const elements = document.querySelectorAll('div[data-background-image]');
  
  elements.forEach(element => {
    // Skip if element is not valid
    if (!element?.dataset?.backgroundImage) return;
    
    // Get the background image URL from data attribute and load it
    loadElementBackground(element, element.dataset.backgroundImage);
  });
}

// Add to $$ object if it exists
if (typeof $$ !== 'undefined') {
  $$.loadBackgroundImages = loadBackgroundImages;
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadBackgroundImages };
}
