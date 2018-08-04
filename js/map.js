(function($, hammer) {

  const mapObj = $('.map');
  const mapHam = new hammer(mapObj[0], { domEvents: true });
  mapHam.get('tap').set({
    enable: true,
    time: 1000
  });

  const width = parseInt(mapObj.css('width'), 10),
    height = parseInt(mapObj.css('height'), 10);
  const projection = d3.geo.equirectangular();
  const oldScale = projection.scale();
  const oldTranslate = projection.translate();
  const xy = projection.scale(oldScale * (width / oldTranslate[0] / 2))
    .translate([width / 2, height / 2]);
  const path = d3.geo.path().projection(xy);
  const svg = d3.select('.map').append('svg')
    .attr('width', width)
    .attr('height', height);

  const TooltipObj = $('.tooltip');

  const showPartnerList = function (name, obj) {
    TooltipObj.find('.PartnerCard').addClass('hide');
    TooltipObj.find('.PartnerList').removeClass('hide');
    const partnerList = d3.select('.partnerList');
    $('.PartnerList').find('h3').html(name);
    $('.PartnerList').find('ul').html(' ');
    partnerList.selectAll('li')
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
        getTooltip(d.name, d, obj.name);
      });
  };

  const getTooltip = function (name, obj, pname) {
    TooltipObj.removeClass('active');
    if (obj.item && obj.item.length > 1) {
      showPartnerList(name, obj);
      setTimeout(function () {
        TooltipObj.addClass('active');
      }, 300);
      return;
    }
    if (obj) {
      const img = TooltipObj.find('.PartnerCard img').css('opacity', 0);
      img.load(function () {
        img.css('opacity', 1);
      });
      if (obj.item) {
        const str = obj.item[0].imgSrc;
        img.attr('src', str.replace(/&amp;/g, '&'));
        TooltipObj.find('.PartnerCard .picSide h2').html(obj.item[0].title);
        TooltipObj.find('.PartnerCard .infoSide ').html(obj.item[0].content);
      } else {
        const imgStr = obj.imgSrc;
        img.attr('src', imgStr.replace(/&amp;/g, '&'));
        TooltipObj.find('.PartnerCard .picSide h2').html(obj.title);
        TooltipObj.find('.PartnerCard .infoSide ').html(obj.content);
        TooltipObj.find('span.cancel').addClass('hasList');
        TooltipObj.find('span.cancel').data('id', pname);
      }
      TooltipObj.find('.PartnerList').addClass('hide');
      TooltipObj.find('.PartnerCard').removeClass('hide');
      setTimeout(function () {
        TooltipObj.addClass('active');
      }, 300);
    }
  };

  const fillColor = function (data) {
    const country = svg.selectAll('.country');
    country.attr('fill', function (d) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].item.length; j++) {
          if (d.id === data[i].item[j].name) {
            return data[i].color;
          }
        }
      }
      return '#05204f';
    });

    // append non-geographic Country marks
    const markData = data.filter(function (d) {
        return (d.name === 'Restricted' && d.item.length !== 0) || (d.name === 'Retirees' && d.item.length !== 0)
      }),
      position = [[width * 0.24, height * 0.60], [width * 0.38, height * 0.38]],
      radio = width * 0.01;

    svg.append('defs')
      .append('filter')
      .attr('id', 'Gaussian_Blur')
      .append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '3');

    if (markData.length > 0) {
      for (let i = 0; i < markData.length; i++) {
        svg.append('g').attr('class', 'mark ' + markData[i].name);
        $('.' + markData[i].name).html(
          `<circle cx="${position[i][0]}" cy="${position[i][1]}" r="${radio}" style="fill:${markData[i].color};"></circle>
           <circle cx="${position[i][0]}" cy="${position[i][1]}" r="${radio}" style="fill:none;stroke:${markData[i].color};stroke-width:2;filter:url(#Gaussian_Blur)">
             <animate attributeName="r" attributeType="XML" begin="0s" dur="2s" fill="freeze" from="${radio * 0.75}" to="${radio * 2.5}" repeatCount="indefinite"/>
             <animate attributeType="CSS" attributeName="opacity"  from="1" to="0" dur="2s" repeatCount="indefinite" />
             <animate attributeType="CSS" attributeName="stroke-width"  from="${radio * 0.5}" to="${radio * 0.1}" dur="2s" repeatCount="indefinite" />
           </circle>`);
      }
      svg.selectAll('.mark').data(markData);
    }
  };

  const drawLegend = function (data) {
    const newData = [];
    $.each(data, function (i, item) {
      if (item.item.length !== 0) {
        newData.push(item);
      }
    });
    const legend = d3.select('.legendBox')
      .selectAll('div')
      .data(newData)
      .enter()
      .append('div')
      .attr('class', 'legendItem');
    legend.append('div')
      .style('width', width * 0.018 + 'px')
      .style('height', width * 0.018 + 'px')
      .style('display', 'inline-block')
      .style('background', function (d) {
        return d.color;
      });
    legend.append('span')
      .html(function (d) {
        return d.name;
      });
  };

  const bindTooltip = function (data) {
    svg.selectAll('.country').on('tap', function (d) {
      $.each(data, function (i, e) {
        $.each(e.item, function (j, ele) {
          if (d.id === ele.name) {
            getTooltip(e.name, ele);
            return false;
          }
        });
      });
    });
    svg.selectAll('.mark').on('tap', function (d) {
      $.each(data, function (i, e) {
        $.each(e.item, function (j, ele) {
          if (d.name === e.name) {
            getTooltip(e.name, ele);
            return false;
          }
        });
      });
    });
  };

  const renderMap = function (world) {
    const zoom = d3.behavior.zoom()
      .scaleExtent([1, 5])
      .on('zoom', zoomed);

    function zoomed() {
      //make sure the map inside the viewport
      // -width*(d3.event.scale-1) < transPos[0] < 0
      // -height*(d3.event.scale-1)*0.8 < transPos[1] < 0
      //tranPos[1] means the yAxis translate
      //about the '0.8' to except the legend height
      const transPos = [
        Math.min(0, Math.max(-width * (d3.event.scale - 1), d3.event.translate[0])),
        Math.min(0, Math.max(-height * (d3.event.scale - 1) * 0.8, d3.event.translate[1]))
      ];
      svg.selectAll('g').attr('transform',
        'translate(' + transPos + ')scale(' + d3.event.scale + ')');
    };

    svg.call(zoom)
      .append('g')
      .selectAll('.subunit')
      .data(world.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', function (d) {
        return 'country ' + d.id;
      })
      .attr('stroke', '#14abe4')
      .attr('fill', '#05204f');

  
    emt.server.getPartners(function(data) {
      fillColor(data);
      drawLegend(data);
      bindTooltip(data);
    });
  };

  const fetchMapData = function(successFn) {
    d3.json('../json/world-country.json', function (error, world) {
      if (error) {
        return console.error(error);
      }
      successFn(world);
    });
  };

  //have list or not
  const checkList = function (selector) {
    if (selector.hasClass('hasList')) {
      selector.removeClass('hasList');
      $('.PartnerCard').addClass('hide');
      $('.PartnerList').removeClass('hide');
      return true;
    }
    return false;
  };

  const bindEvent = function () {
    $('.map .cancel').on('tap', window.emt.map.cancel());
    $('.map .reset').on('tap', window.emt.map.reset());
  };

  window.emt = window.emt ? window.emt : { };
  window.emt.map = {

    cancel: function () {
      console.info("cancel called");
      if (checkList($(".map .cancel"))) {
        return;
      }
      $(".map cancel").parent().removeClass('active');
    },

    reset: function () {
      console.info("reset called");
      svg.selectAll('g').attr('transform',
        'translate(0,0)scale(1)');
      const zoom = d3.behavior.zoom()
        .scaleExtent([1, 5])
        .on('zoom', zoomed);
      function zoomed() {
        //make sure the map inside the viewport
        //0 > transPos[0] > -width*(d3.event.scale-1)
        //0 > transPos[1] > -height*(d3.event.scale-1)*0.8
        //tranPos[1] means the yAxis translate
        //about the '0.8' to except the legend height
        const transPos = [
          Math.min(0, Math.max(-width * (d3.event.scale - 1), d3.event.translate[0])),
          Math.min(0, Math.max(-height * (d3.event.scale - 1) * 0.8, d3.event.translate[1]))
        ];
        svg.selectAll('g').attr('transform',
          'translate(' + transPos + ')scale(' + d3.event.scale + ')');
      }
      svg.call(zoom);
    }
  };

  fetchMapData(renderMap);
  bindEvent();

})(jQuery, Hammer);