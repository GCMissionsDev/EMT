(function($, hammer) {

  const colors = {
    countryOutline: '#14abe4',
    countryFill: '#05204f'
  };

  // Color Translation Hack - remove when the front end truly controls the countries colors
  const colorTranslations = [
    { orig: '#2dd239', repl: '#2dd239' },
    { orig: '#ff8000', repl: '#ff8000' },
    { orig: '#80ffff', repl: '#80ffff' },
    { orig: '#be9649', repl: '#be9649' },
    { orig: '#f1f129', repl: '#f1f129' },
    { orig: '#408080', repl: '#408080' },
    { orig: '#ff0080', repl: '#ff0080' },
    { orig: '#80ff00', repl: '#8c769f' }  //   5a3972
  ];

  const colorTranslate = function(color) {
    for (let ctr of colorTranslations) {
      if (ctr.orig === color) return ctr.repl;
    }
    return color;
  };

  const mapObj = $('.map');
  const mapHam = new hammer(mapObj[0], { domEvents: true });
  mapHam.get('tap').set({
    enable: true,
    time: 1000
  });

  const mapWidth = parseInt(mapObj.css('width'), 10),
    mapHeight = parseInt(mapObj.css('height'), 10);
  const projection = d3.geo.equirectangular();
  const oldScale = projection.scale();
  const oldTranslate = projection.translate();
  const xy = projection.scale(oldScale * (mapWidth / oldTranslate[0] / 2))
    .translate([mapWidth / 2, mapHeight / 2]);
  const path = d3.geo.path().projection(xy);
  const svg = d3.select('.map').append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight);

  const fillColor = function (data) {
    const country = svg.selectAll('.country');
    country.attr('fill', function (d) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].item.length; j++) {
          if (d.id === data[i].item[j].name) {
            return colorTranslate(data[i].color);
          }
        }
      }
      return colors.countryFill;
    });

    // append non-geographic "country" marks
    const markData = data.filter(function (d) {
        return (d.name === 'Restricted' || d.name === 'Retirees') && d.item.length !== 0;
      }),
      position = [[mapWidth * 0.24, mapHeight * 0.60], [mapWidth * 0.38, mapHeight * 0.38]],
      radius = mapWidth * 0.01;

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
          `<circle cx="${position[i][0]}" cy="${position[i][1]}" r="${radius}" style="fill:${colorTranslate(markData[i].color)};"></circle>
           <circle cx="${position[i][0]}" cy="${position[i][1]}" r="${radius}" style="fill:none;stroke:${colorTranslate(markData[i].color)};stroke-width:2;filter:url(#Gaussian_Blur)">
             <animate attributeName="r" attributeType="XML" begin="0s" dur="2s" fill="freeze" from="${radius * 0.75}" to="${radius * 2.5}" repeatCount="indefinite"/>
             <animate attributeType="CSS" attributeName="opacity"  from="1" to="0" dur="2s" repeatCount="indefinite" />
             <animate attributeType="CSS" attributeName="stroke-width"  from="${radius * 0.5}" to="${radius * 0.1}" dur="2s" repeatCount="indefinite" />
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
      .style('width', mapWidth * 0.018 + 'px')
      .style('height', mapWidth * 0.018 + 'px')
      .style('display', 'inline-block')
      .style('background', function (d) {
        return colorTranslate(d.color);
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
            emt.partners.showPartnerCard(e.name, ele);
            return false;
          }
        });
      });
    });
    svg.selectAll('.mark').on('tap', function (d) {
      $.each(data, function (i, e) {
        $.each(e.item, function (j, ele) {
          if (d.name === e.name) {
            emt.partners.showPartnerCard(e.name, ele);
            return false;
          }
        });
      });
    });
  };

  const zoomed = function() {
    //make sure the map inside the viewport
    // 0 > transPos[0] > -width*(d3.event.scale-1)
    // 0 > transPos[1] > -height*(d3.event.scale-1)*0.8
    //tranPos[1] means the yAxis translate
    //about the '0.8' to except the legend height
    const transPos = [
      Math.min(0, Math.max(-mapWidth * (d3.event.scale - 1), d3.event.translate[0])),
      Math.min(0, Math.max(-mapHeight * (d3.event.scale - 1) * 0.8, d3.event.translate[1]))
    ];
    svg.selectAll('g').attr('transform',
      'translate(' + transPos + ')scale(' + d3.event.scale + ')');
  };

  const renderMap = function (world) {
    const zoom = d3.behavior.zoom()
      .scaleExtent([1, 5])
      .on('zoom', zoomed);

    svg.call(zoom)
      .append('g')
      .selectAll('.subunit')
      .data(world.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', function (d) {
        return 'country ' + d.id;
      })
      .attr('stroke', colors.countryOutline)
      .attr('fill', colors.countryFill);

  
    emt.server.getPartners(function(data) {
      fillColor(data);
      drawLegend(data);
      bindTooltip(data);
    });
  };

  const fetchMapData = function(successFn) {
    d3.json('../json/world-country.json', function (error, world) {
      if (error) {
        return emt.log.error(error);
      }
      successFn(world);
    });
  };

  window.emt = window.emt ? window.emt : { };
  window.emt.map = {

    reset: function () {
      svg.selectAll('g').attr('transform',
        'translate(0,0)scale(1)');
      const zoom = d3.behavior.zoom()
        .scaleExtent([1, 5])
        .on('zoom', zoomed);

      svg.call(zoom);
    }

  };

  const bindEvent = function () {
    $('.map .reset').on('tap', emt.map.reset);
  };

  fetchMapData(renderMap);
  bindEvent();

})(jQuery, Hammer);