(function($, hammer) {

  "use strict";

  // Set up touch functionality for the resources
  const canHam = new hammer($('.iframeBox .cancel')[0], { domEvents: true });
  canHam.get('tap').set({
      enable: true,
      time: 1000
  });

  const resHam = new hammer($('.resBox')[0], { domEvents: true });
  resHam.get('tap').set({
    enable: true,
    time: 1000
  });

  window.emt = window.emt ? window.emt : { };
  window.emt.resources = {

    render: function(data) {
      if (data.length < 4) {
        $('.resItem').removeClass('scrollbar').css('overflow-x', 'hidden');
      }
      $.each(data, function (i, it) {
        $('.menu .resBox')
          .append(
            `<div class="res" data-url ="${it.url}" data-remarks ="${it.remarks}">
               <img src="${it.imgSrc}" alt="">
               <img src="../img/picBox.png" alt="">
               <h2 title="${it.title}">${it.title}</h2>
             </div>`);
      });
      const resMarginRight = $('.res').width() / 6;
      $('.res').css('margin-right', resMarginRight + 'pt');
      $('.resBox').css('width', (($('.res').width()) * (data.length - 0.5)) + 'pt');
      $('.resBox').css('touch-action', 'pan-x');
    },

    bindEvents: function() {
      $('body').on('tap', '.res', function () {
        const url = $(this).data('url'),
          remarks = $(this).data('remarks');
        if (remarks === 1) {
          $('#iframe').html('<iframe src="' + url + '" frameborder="0"></iframe>');
        } else if (remarks === 0) {
          $('#iframe').html('<video src="' + url + '" controls autoplay></video>');
        }

        $('.iframeBox').removeClass('hide');
        $('.resBoxContainer').addClass('hide');
      });
      $('.iframeBox .cancel').on('tap', emt.resources.cancel());
      $('.resBox').on('pan', function (e) {
        $(this).scrollTop($(this).scrollTop() - e.originalEvent.gesture.deltaY);
        $(this).scrollLeft($(this).scrollLeft() - e.originalEvent.gesture.deltaX);
      });
    },

    cancel: function () {
      $('#iframe').html(' ');
      $('.resBoxContainer').removeClass('hide');
      $('.iframeBox').addClass('hide');
    }

  };

  emt.server.getResources(emt.resources.render);
  emt.resources.bindEvents();

})(jQuery, Hammer);
