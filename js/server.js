(function($) {
  const useMockServer = true;

  const serverMethod = useMockServer ? 'GET' : 'POST';
  const apiLocation = useMockServer ? "http://localhost:3000" : window.location.origin;
  const baseURL = apiLocation + '/crh-admin/web';

  window.emt = window.emt ? window.emt : { };
  window.emt.server = {

    getPartners: function(successFn) {
      const partnerUrl = `${baseURL}/partner/show`;
      $.ajax({
        url: partnerUrl,
        type: serverMethod
      }).done(function (data) {
        data = useMockServer ? data : JSON.parse(data);
        if (data.message === 'SUCCESS') {
          successFn(data.data);
        } else {
          console.error(data.message);
        }
      });
    },

    getValues: function(successFn) {
      const valuesUrl = `${baseURL}/mission/show`;
      $.ajax({
        url: valuesUrl,
        type: serverMethod
      }).done(function (data) {
        successFn(useMockServer ? data : JSON.parse(data));
      });
    },

    getSlides: function(successFn) {
      const slidesUrl = `${baseURL}/slide/show`;
      $.ajax({
        url: slidesUrl,
        type: serverMethod
      }).done(function (data) {
        data = useMockServer ? data : JSON.parse(data);
        if (data.message === 'SUCCESS') {
          successFn(data.data.imageList);
        } else {
          console.error(data.message);
        }
      });
    },

    getResources: function(successFn) {
      const resourceUrl = `${baseURL}/resource/show`;
      $.ajax({
        url: resourceUrl,
        type: serverMethod
      }).done(function (data) {
        data = useMockServer ? data : JSON.parse(data);
        if (data.message === 'SUCCESS') {
          successFn(data.data);
        } else {
          console.error(data.message);
        }
      });
    }

  };

})(jQuery);