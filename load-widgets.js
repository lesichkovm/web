const widgets = document.querySelectorAll('[data-widget-url]');

widgets.forEach((widget)=>{

  const url = widget.dataset.widgetUrl;

  fetch(url).then((response) => {
    return response.text();
  }).then((html)=>{
    widget.innerHTML = html;
  });
  
});
