(function(){
	var baseURL = window.location.origin+'/crh-admin/web';
	var mapObj = $('.map');
	var sliderHam = new Hammer($('.slider')[0],{domEvents:true});
	var mapHam = new Hammer($('.map')[0],{domEvents:true});
		mapHam.get('tap').set({ enable: true})
	var resBoxHam = new Hammer($('.resBox')[0],{domEvents:true});
	var iframeHam = new Hammer($('.iframeBox .close')[0],{domEvents:true});
	var width = parseInt(mapObj.css('width'), 10),
	    height = parseInt(mapObj.css('height'), 10);
	var projection = d3.geo.equirectangular();
	var oldScala = projection.scale();
	var oldTranslate = projection.translate();
	var xy = projection.scale(oldScala * (width / oldTranslate[0] / 2) )
	  					.translate([width / 2, height / 2]);
	var path = d3.geo.path().projection(xy);
	var svg = d3.select('.map').append('svg')
	    .attr('width', width)
	    .attr('height', height);
	var TooltipObj =$('.tooltip');
	var showPartnerList = function(name,obj){
		TooltipObj.find('.PartnerCard').addClass('hide');
		TooltipObj.find('.PartnerList').removeClass('hide');
		var partnerList = d3.select('.partnerList');
		$('.PartnerList').find('h3').html(name);
		$('.PartnerList').find('ul').html(' ');
		partnerList.selectAll('li')
				.data(obj.item)
				.enter()
				.append('li')
				.attr('class',function(d){
					return d.name;
				})
				.html(function(d){
					return d.name;
				})
				.on('tap',function(d){
					getTooltip(d.name,d,obj.name);
				});
	};
	var getTooltip = function(name,obj,pname){
		TooltipObj.removeClass('active');
		if(obj.item && obj.item.length>1){
			showPartnerList(name,obj);
			setTimeout(function(){
				TooltipObj.addClass('active');
			},300);
			return;
		}
		if(obj){
			var img = TooltipObj.find('.PartnerCard img').css('opacity',0);
			img.load(function(){
				img.css('opacity',1);
			});
			if(obj.item){
				var str = obj.item[0].imgSrc;
				img.attr('src',str.replace(/&amp;/g,'&'));
				TooltipObj.find('.PartnerCard .picSide h2').html(obj.item[0].title);
				TooltipObj.find('.PartnerCard .infoSide ').html(obj.item[0].content);
			}else{//have 
				var imgStr = obj.imgSrc;
				img.attr('src',imgStr.replace(/&amp;/g,'&'));
				TooltipObj.find('.PartnerCard .picSide h2').html(obj.title);
				TooltipObj.find('.PartnerCard .infoSide ').html(obj.content);
				TooltipObj.find('span.close').addClass('hasList');
				TooltipObj.find('span.close').data('id',pname);
			}
			TooltipObj.find('.PartnerList').addClass('hide');
			TooltipObj.find('.PartnerCard').removeClass('hide');
			setTimeout(function(){
				TooltipObj.addClass('active');
			},300);
		}else{
			return ;
		}
	};
    var fillColor = function(data){
    	var country = svg.selectAll('.country');
    	country.attr('fill',function(d){
	    			for(var i = 0;i<data.length;i++)
	    			{
	    				for(var j = 0 ;j<data[i].item.length;j++)
	    				{
	    					if(d.id === data[i].item[j].name){
	    						return data[i].color;
	    					}
	    				}
	    			}
	    			return '#05204f';
	    		});
    	/*append non-geographic Country marks*/
		var markData = data.filter(function(d){return (d.name =='Restricted'&&d.item.length!=0)||(d.name=='Retirees'&&d.item.length!=0)}),
			position = [[width*0.24,height*0.60],[width*0.38,height*0.38]],
			radio = width*0.01;

			svg.append('defs')
				.append('filter')
				.attr('id','Gaussian_Blur')
				.append('feGaussianBlur')
				.attr('in','SourceGraphic')
				.attr('stdDeviation','3')
		    if(markData.length>0){
		    	for(var i = 0 ;i<markData.length;i++)
		    	{
		    		svg.append('g')
			    		.attr('class','mark '+markData[i].name)
			    	 $('.'+markData[i].name).html('<circle cx="'+position[i][0]+'" cy="'+position[i][1]+'" r="'+radio+'" style="fill:'+markData[i].color+';"></circle>'+
										'<circle cx="'+position[i][0]+'" cy="'+position[i][1]+'" r="'+radio+'" style="fill:none;stroke:'+markData[i].color+'; stroke-width:2;filter:url(#Gaussian_Blur)">'+
											'<animate attributeName="r" attributeType="XML" begin="0s" dur="2s" fill="freeze" from="'+radio*0.75+'" to="'+radio*2.5+'" repeatCount="indefinite"/>'+
											'<animate attributeType="CSS" attributeName="opacity"  from="1" to="0" dur="2s" repeatCount="indefinite" />'+
											'<animate attributeType="CSS" attributeName="stroke-width"  from="'+radio*0.5+'" to="'+radio*0.1+'" dur="2s" repeatCount="indefinite" />'+
										'</circle>');
		    	}
			    svg.selectAll('.mark').data(markData)
		    }
    };
    var drawLegend = function(data){
    	var newData=[];
    	$.each(data,function(i,item){
			if(item.item.length!==0){
    			newData.push(item);
    		};
    	});
    	var legend = d3.select('.legendBox')
    					.selectAll('div')
	    				.data(newData)
	    				.enter()
	    				.append('div')
	    				.attr('class','legendItem');
	    legend.append('div')
	    				.style('width',width*0.018+'px')
	    				.style('height',width*0.018+'px')
	    				.style('display','inline-block')
	    				.style('background',function(d){return d.color;})
	    legend.append('span')
	    		.html(function(d) { return d.name; });
	    
    };
	var bindTooltip = function(data){
		svg.selectAll('.country')
			.on('tap',function(d){
				$.each(data,function(i,e){
					$.each(e.item,function(j,ele){
						if(d.id === ele.name){
							getTooltip(e.name,ele);
							return false;
						};
					});
				});
			});
		svg.selectAll('.mark')
			.on('tap',function(d){
				$.each(data,function(i,e){
					$.each(e.item,function(j,ele){
						if(d.name === e.name){
							getTooltip(e.name,ele);
							return false;
						};
					});
				});
			});
	};
    var getAreaData = function(){
    	// var partnerUrl = '../json/areaSourse.json';
    	var partnerUrl = baseURL+'/partner/show';
    	$.ajax({url:partnerUrl,
				type:'POST',
				}).done(function(data){
					data = JSON.parse(data);
					if(data.message==='SUCCESS'){
						fillColor(data.data);
			    		drawLegend(data.data);
			    		bindTooltip(data.data);

					}else{
						console.error(data.message);
					}
				});
		var missionUrl = baseURL+'/mission/show'
		$.ajax({url:missionUrl,
				type:'POST',
				}).done(function(data){
					data = JSON.parse(data);
					if(data.modelId=== 1){						
						$('.menu .picTitle').show()
						$('.resSlogan').html('<div class="sSlogan scrollbar">'
												+'<h3>'+data.missions[0].title+'</h3>'
												+'<p>'+data.missions[0].content+'</p>'
											+'</div>'
											+'<div class="sSlogan scrollbar">'
												+'<h3>'+data.missions[1].title+'</h3>'
												+'<p>'+data.missions[1].content+'</p>'
											+'</div>'
											+'<div class="bSlogan scrollbar">'
												+'<h3>'+data.missions[2].title+'</h3>'
												+'<p>'+data.missions[2].content+'</p>'
											+'</div>'
											+'<div class="bSlogan scrollbar">'
												+'<h3>'+data.missions[3].title+'</h3>'
												+'<p>'+data.missions[3].content+'</p>'
											+'</div>')
					}else if(data.modelId === 2){
						$('.menu .picTitle').hide()
						$('.resSlogan').html('<div class="welcomeSlogan">'+
												'<h2 class="h2">'+
													'<span class="title span">'+data.salutatoryEntity.title+'</span>'+
													'<br>'+
													'<span class="line span"></span>'+
												'</h2>'+
												'<div class="content scrollbar"></div>'+
											'</div>');
						function escape2Html(str) {   
					 				var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};   
									return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,i){return arrEntities[i];});   
								};  
						var tem = escape2Html(data.salutatoryEntity.content )
						$('.welcomeSlogan .content').append(tem)
					}
				});
    };
    var renderMap = function(world){
    	var zoom = d3.behavior.zoom()
					.scaleExtent([1, 5])
					.on('zoom', zoomed);
		function zoomed() {
			//make sure the map inside the viewport
			// -width*(d3.event.scale-1) < transPos[0] < 0
			// -height*(d3.event.scale-1)*0.8 < transPos[1] < 0
			//tranPos[1] means the yAxis translate 
			//about the '0.8' to except the legend height 
			var transPos = [
							Math.min(0,Math.max(-width*(d3.event.scale-1),d3.event.translate[0])),
							Math.min(0,Math.max(-height*(d3.event.scale-1)*0.8,d3.event.translate[1]))
							];
				svg.selectAll('g').attr('transform',
				'translate(' + transPos+ ')scale(' + d3.event.scale + ')');			
		};
		
		svg.call(zoom)
			.append('g')
			.selectAll('.subunit')
		    .data(world.features)
		    .enter().append('path')
		    .attr('d', path)
		    .attr('class',function(d){return 'country '+d.id;})
		    .attr('stroke','#14abe4')
		    .attr('fill','#05204f');
		
		getAreaData();
    };
    var fetchMapData = function(){
    	d3.json('../json/world-country.json',function(error, world){
    		if (error){
    			return console.error(error);
    		};
    		renderMap(world);
    	});
    };
    var renderSlider = function(data){
		$.each(data,function(i,item){
			$('.poster-list').append('<li class="poster-item"><img src="'+item+'" /></li>');
		});
		/*Slider*/
		var sliderWidth = parseInt($('.poster-main').css('width'), 10),
			sliderHeight = parseInt($('.slider').css('height'), 10);
			Carousel.init($('#carousel'),
						{'width':sliderWidth,
						'height':sliderHeight,
						'posterWidth':sliderWidth/2.4,
						'posterHeight':sliderHeight
					});
		    sliderHam.on('swipeleft',function(){
		    	$('.poster-prev-btn').click();
		    });
		    sliderHam.on('swiperight',function(){
		    	$('.poster-next-btn').click();
		    });
		/*Slider*/
	};
	var getSlider = function(){
		var silderUrl = baseURL+'/slide/show';
		$.ajax({url:silderUrl,
			type:'POST',
			}).done(function(data){
				data = JSON.parse(data);
				if(data.message==='SUCCESS'){
					renderSlider(data.data.imageList);
				}else{
					console.error(data.message);
				}
			});
	};
	var renderResourse = function(data){
		if(data.length<4)
		{
			$('.resItem').removeClass('scrollbar');
			$('.resItem').css('overflow-x','hidden');
		}
		$('.resBox').css('width',(document.body.offsetWidth/7)*data.length+'px');
		$.each(data,function(i,item){
			$('.menu .resBox').append('<div class="res" data-url ="'+item.url+'" data-remarks ="'+item.remarks+'">'+
										'<img src="'+item.imgSrc+'" alt="">'+
										'<img src="../img/picBox.png" alt="">'+
										'<h2 title="'+item.title+'">'+item.title+'</h2>'+
									'</div>');
		});
		var resMarginRight =Math.ceil( ($('.resBoxContainer').width()-3*$('.res').width())/2.3)
										+ 'px';
		$('.res').css('margin-right',resMarginRight);
	};
	var getResourse = function(){
		var resourceUrl = baseURL + '/resource/show';
		$.ajax({url:resourceUrl,
			type:'POST',
			}).done(function(data){
				data = JSON.parse(data);
				if(data.message==='SUCCESS'){
					renderResourse(data.data);

				}else{
					console.error(data.message);
				}
			});
	};
	//have list or not
	var checkList = function(selector){
		if(selector.hasClass('hasList'))
		{
			selector.removeClass('hasList');
			$('.PartnerCard').addClass('hide');
			$('.PartnerList').removeClass('hide');
			return true;
		}
		return false;
	};
    var bindEvent = function(){
    	$('body').on('tap','.res',function(){
			var url = $(this).data('url'),
			remarks = $(this).data('remarks');
			if(remarks === 1){
				$('#iframe').html('<iframe src="'+url+'" frameborder="0"></iframe>')
			}else if(remarks === 0){
				$('#iframe').html('<video src="'+url+'" controls autoplay></video>')
			}

			$('.iframeBox').removeClass('hide');
			$('.resBoxContainer').addClass('hide');
		});
		$('.iframeBox .close').on('tap',function(){
			$('#iframe').html(' ');
			$('.resBoxContainer').removeClass('hide');
			$('.iframeBox').addClass('hide');
		});
		$('.close').on('tap',function(){
			if(checkList($(this))){
				return ;
			}
			$(this).parent().removeClass('active');
		});
		$('.resBox').on('pan',function(e){
			$(this).scrollTop($(this).scrollTop()-e.originalEvent.gesture.deltaY);
			$(this).scrollLeft($(this).scrollLeft()-e.originalEvent.gesture.deltaX);
		});
		$('.reset').on('tap',function(){
	    	svg.selectAll('g').attr('transform',
					'translate(0,0)scale(1)');
			var zoom = d3.behavior.zoom()
						.scaleExtent([1, 5])
						.on('zoom', zoomed);
			function zoomed() {
				//make sure the map inside the viewport
				//0 > transPos[0] > -width*(d3.event.scale-1)
				//0 > transPos[1] > -height*(d3.event.scale-1)*0.8
				//tranPos[1] means the yAxis translate 
				//about the '0.8' to except the legend height 
				var transPos = [
								Math.min(0,Math.max(-width*(d3.event.scale-1),d3.event.translate[0])),
								Math.min(0,Math.max(-height*(d3.event.scale-1)*0.8,d3.event.translate[1]))
								];
					svg.selectAll('g').attr('transform',
					'translate(' + transPos+ ')scale(' + d3.event.scale + ')');		
			};	
	    	svg.call(zoom)
	    })
    };
    getSlider();
	fetchMapData();
    getResourse();
	bindEvent();
})();
