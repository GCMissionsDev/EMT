(function($, _) {

  window.emt = window.emt ? window.emt : { };
  window.emt.version = 'EMT v0.95';

  // LOGGING

  // Log Levels:
  //  trace: 0   info:    3   none: 6
  //  debug: 1   warning: 4
  //  log:   2   error:   5
  let logLevel = 2;
  let logPrefix = 'emt';
  let logTime = false;

  const _log = function(lvl, logFn, ...args) {
    if (logLevel <= lvl) {
      const moreArgs = logTime ? [new Date(Date.now()).toISOString(), logPrefix ] : [ logPrefix ];
      logFn.apply(null, _.concat(moreArgs, args));
    }
  };

  window.emt.log = {

    trace: function() {
      _log(0, console.log, ...arguments);
    },

    debug: function() {
      _log(1, console.log, ...arguments);
    },

    log: function() {
      _log(2, console.log, ...arguments);
    },

    info: function() {
      _log(3, console.info, ...arguments);
    },

    warning: function() {
      _log(4, console.warn, ...arguments);
    },

    error: function() {
      _log(5, console.error, ...arguments);
    },

    setLogLevel: function(newLevel) {
      if (newLevel > -1 && newLevel < 7) logLevel = newLevel;
    },

    setLogPrefix: function(newPrefix) {
      logPrefix = newPrefix;
    },

    setLogTime: function(newTimeBoolean) {
      logTime = newTimeBoolean;
    }

  };


  emt.log.info(emt.version);

})(jQuery, _);