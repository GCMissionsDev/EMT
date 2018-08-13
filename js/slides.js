(function($, hammer, carousel) {

  const sliderHam = new hammer($('.slider')[0], { domEvents: true });

  window.emt = window.emt ? window.emt : { };
  window.emt.slides = {

    render: function(data) {
      $.each(data, function (i, item) {
        $('.poster-list').append(`<li class="poster-item"><img src="${item}"></li>`);
      });

      const sliderWidth = parseInt($('.poster-main').css('width'), 10),
        sliderHeight = parseInt($('.slider').css('height'), 10);
      carousel.init($('#carousel'),
        {
          'width': sliderWidth,
          'height': sliderHeight,
          'posterWidth': sliderWidth / 2.4,
          'posterHeight': sliderHeight
        });
      sliderHam.on('swipeleft', function () {
        $('.poster-prev-btn').click();
      });
      sliderHam.on('swiperight', function () {
        $('.poster-next-btn').click();
      });
    }

  };

  emt.server.getSlides(emt.slides.render);

})(jQuery, Hammer, Carousel);
