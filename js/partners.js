(function ($) {

  const sel = {
    tooltip: '.tooltip',
    partnerCard: '.PartnerCard',
    partnerList: '.PartnerList',
    partnerListUl: '.partner-list',
    cancelBtn: '.map .cancel'
  };

  const jqPartnerTT = $(sel.tooltip);

  window.emt = window.emt ? window.emt : {};
  window.emt.partners = {

    showPartnerList: function (name, obj) {
      jqPartnerTT.find(sel.partnerCard).addClass('hide');
      const jqPartnerList = jqPartnerTT.find(sel.partnerList);
      jqPartnerList.removeClass('hide').find('h3').html(name);
      jqPartnerList.find('ul').html('');
      const d3PartnerList = d3.select(sel.partnerListUl);
      d3PartnerList.selectAll('li')
        .data(obj.item)
        .enter()
        .append('li')
        .attr('class', function (d) {
          return d.name;
        })
        .html(function (d) {
          return d.name;
        })
        .on('tap', function (d) {
          emt.partners.showPartnerCard(d.name, d, obj.name);
        });
    },

    showPartnerCard: function (name, obj, partnerName) {
      jqPartnerTT.removeClass('active');
      if (obj.item && obj.item.length > 1) {
        emt.partners.showPartnerList(name, obj);
        setTimeout(function () {
          jqPartnerTT.addClass('active');
        }, 300);
        return;
      }
      if (obj) {
        const img = jqPartnerTT.find(`${sel.partnerCard} img`).css('opacity', 0);
        img.load(function () {
          img.css('opacity', 1);
        });
        if (obj.item) {
          const str = obj.item[0].imgSrc;
          img.attr('src', str.replace(/&amp;/g, '&'));
          jqPartnerTT.find(`${sel.partnerCard} .picSide h2`).html(obj.item[0].title);
          jqPartnerTT.find(`${sel.partnerCard} .infoSide`).html(obj.item[0].content);
        } else {
          const imgStr = obj.imgSrc;
          img.attr('src', imgStr.replace(/&amp;/g, '&'));
          jqPartnerTT.find(`${sel.partnerCard} .picSide h2`).html(obj.title);
          jqPartnerTT.find(`${sel.partnerCard} .infoSide`).html(obj.content);
          jqPartnerTT.find('span.cancel').addClass('hasList').data('id', partnerName);
        }
        jqPartnerTT.find(sel.partnerList).addClass('hide');
        jqPartnerTT.find(sel.partnerCard).removeClass('hide');
        setTimeout(function () {
          jqPartnerTT.addClass('active');
        }, 300);
      }
    },

    cancel: function() {
      const jqCancelBtn = $(sel.cancelBtn);
      emt.log.info("emt.map.cancel called", jqCancelBtn, jqCancelBtn.parent());
      if (jqCancelBtn.hasClass('hasList')) {
        jqCancelBtn.removeClass('hasList');
        $(sel.partnerCard).addClass('hide');
        $(sel.partnerList).removeClass('hide');
      } else {
        jqPartnerTT.removeClass('active');
      }
    },

    closeAll: function() {
      $(sel.cancelBtn).removeClass('hasList');
      $(sel.partnerCard).addClass('hide');
      $(sel.partnerList).removeClass('hide');
      jqPartnerTT.removeClass('active');
    }

  };

  const bindEvent = function () {
    emt.log.trace('bindEvent in partners.js called');
    $(sel.cancelBtn).on('tap', window.emt.partners.cancel);
  };

  bindEvent();

})(jQuery);