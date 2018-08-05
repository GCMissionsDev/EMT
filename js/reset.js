(function($) {

  let time = Date.now();
  const MINUTE_LIMIT = 0.25;
  const TIME_LIMIT = MINUTE_LIMIT * 60000; //MINUTE_LIMIT in milliseconds

  let resetTimeout;

  const resetFn = function() {
    emt.log.log('resetting screen');
    emt.map.reset();
    emt.partners.closeAll();
    emt.resources.cancel();
  };

  window.emt = window.emt ? window.emt : { };
  window.emt.reset = {

    resetTime: function () {
      time = Date.now();
      emt.log.trace(`resetTimeout: time:${time} limit:${TIME_LIMIT}`);
      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(resetFn, TIME_LIMIT);
    }

  };

  window.emt.reset.resetTime();

})(jQuery);