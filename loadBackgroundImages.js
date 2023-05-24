// TODO remove JQuery dependency
function loadBackgroundImages() {
  $('div[data-background-image]').each(function () {
    var url = $(this).data('background-image');
    $(this).find('span.fa-spin').hide();
    $(this).css('background-image', 'url(' + url + ')');
  });
}
