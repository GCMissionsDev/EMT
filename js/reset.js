(function($, hammer) {

  let time = Date.now();
  const MINUTE_LIMIT = 0.5;
  const TIME_LIMIT = MINUTE_LIMIT * 60000; //MINUTE_LIMIT in milliseconds

  window.emt = window.emt ? window.emt : { };
  window.emt.reset = {

    resetTime: function () {
      time = Date.now();
      setTimeout(emt.reset.checkReset, TIME_LIMIT);
      console.info(`oh hey there - time:${time} limit:${TIME_LIMIT}`);
    },

    checkReset: function () {
      if (Date.now() - TIME_LIMIT >= time){
        emt.reset.reset();
      }
    },

    reset: function () { //TODO: When map.js refactored, use methods
      console.info('reset');
      window.emt.map.cancel();
      window.emt.map.reset();
      window.emt.resources.cancel();
    }

  };

  console.info("loaded emt.reset fool");

  window.emt.reset.resetTime();

})(jQuery, Hammer);