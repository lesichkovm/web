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
          for (var i=0; i < codes.length; i++)  {  
              eval(codes[i].text);  
          }
      });
  });
  
}
