(function($) {

  window.emt = window.emt ? window.emt : { };
  window.emt.values = {

    render: function(data) {
      if (data.modelId === 1) {
        $('.menu .picTitle').show();
        $('.resSlogan')
          .html(`<div class="sSlogan scrollbar">
                   <h3>${data.missions[0].title}</h3>
                   <p>${data.missions[0].content}</p>
                 </div>
                 <div class="sSlogan scrollbar">
                   <h3>${data.missions[1].title}</h3>
                   <p>${data.missions[1].content}</p>
                 </div>
                 <div class="bSlogan scrollbar">
                   <h3>${data.missions[2].title}</h3>
                   <p>${data.missions[2].content}</p>
                 </div>
                 <div class="bSlogan scrollbar">
                   <h3>${data.missions[3].title}</h3>
                   <p>${data.missions[3].content}</p>
                 </div>`);
      } else if (data.modelId === 2) {
        $('.menu .picTitle').hide();
        $('.resSlogan')
          .html(`<div class="welcomeSlogan">
                   <h2 class="h2">
                     <span class="title span">${data.salutatoryEntity.title}</span>
                     <br>
                     <span class="line span"></span>
                   </h2>
                   <div class="content scrollbar"></div>
                 </div>`);
        function escape2Html(str) {
          const arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
          return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, i) {
            return arrEntities[i];
          });
        }
        const tem = escape2Html(data.salutatoryEntity.content);
        $('.welcomeSlogan .content').append(tem);
      }
    }

  };

  emt.server.getValues(emt.values.render);

})(jQuery);
