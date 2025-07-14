function loadWidgets() {
  const widgets = document.querySelectorAll('[data-widget-url]');
  
  widgets.forEach((widget)=>{
    const url = widget.dataset.widgetUrl;
    
    fetch(url).then(function(response) {
      return response.text();
    }).then((html)=>{
      // Load HTML
      widget.innerHTML = html;
    
      // Execute scripts
      const codes = widget.getElementsByTagName("script");
      for (let i=0; i < codes.length; i++) {  
        try {
          // Create a new script element and execute its content
          const script = document.createElement('script');
          script.text = codes[i].text;
          document.head.appendChild(script).parentNode.removeChild(script);
        } catch (e) {
          console.error('Error executing widget script:', e);
        }
      }
    }).catch(error => {
      console.error('Error loading widget:', url, error);
    });
  });
}

// Add to Initialize prototype if it exists
if (typeof Initialize !== 'undefined') {
  Initialize.prototype.loadWidgets = loadWidgets;
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadWidgets };
}

// Add to window.$$ if it exists
if (typeof window !== 'undefined' && window.$$) {
  window.$$.loadWidgets = loadWidgets;
}
