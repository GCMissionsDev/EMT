/**
 * jQuery Carousel.js 
 * https://github.com/LikaiLee/Carousel
 * MIT licensed
 * 
 * Author LikaiLee  HDU
 * Copyright (C) 2016 
 */
 (function($) {
    var Carousel = function(poster,option) {
        var me = this;
        this.poster = poster;
        this.posterItemMain = poster.find(".poster-list"); 
        this.nextBtn = poster.find(".poster-next-btn");
        this.prevBtn = poster.find(".poster-prev-btn");
        this.posterItems = poster.find(".poster-item");

        if (this.posterItems.size() % 2 == 0) {
            this.posterItemMain.append(this.posterItems.eq(this.posterItems.size()/2-1).clone());
            this.posterItems = this.posterItemMain.children();
        };
        this.posterFirstItem = this.posterItems.first(); 

        this.posterLastItem = this.posterItems.last(); 
        this.rotateFlag = true;

        //defult
        this.setting = $.extend({
            //"width": 1000,
            "height": 270,
            "posterWidth": 640, 
            "posterHeight": 270, 
            "scale": 0.7, 	
            "speed": 1000,
            "autoPlay": true,
            "delay": 4000,
            "verticalAlign": "middle" //top bottom middle
        },option);
        this.setSettingValue();
        this.setPosterPos();
        this.nextBtn.click(function() {
            if (me.rotateFlag) {
                me.rotateFlag = false;
                me.carouselRotate("right");
            };

        });
        this.prevBtn.click(function() {
            if (me.rotateFlag) {
                me.rotateFlag = false;
                me.carouselRotate("left");
            };
        });
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function() {
                clearInterval(me.timer);
            },
            function() {
                me.autoPlay();
            });
        };

    };
    Carousel.prototype = {
        autoPlay: function() {
            var self = this;
            this.timer = setInterval(function() {
                self.nextBtn.click();
            },
            this.setting.delay);
        },

        //
        /**
         * [carouselRotate ]
         * @param  {[type]} dir []
         * @return {[type]}     [description]
         */
        carouselRotate: function(dir) {
            var _this_ = this;
            var zIndexArr = [];
            if (dir === "left") {
                this.posterItems.each(function() {
                    var self = $(this),
                    prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                    width = prev.width(),
                    height = prev.height(),
                    zIndex = prev.css("z-index"),
                    opacity = prev.css("opacity"),
                    left = prev.css("left"),
                    top = prev.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex:zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    },
                    _this_.setting.speed,
                    function() {
                        _this_.rotateFlag = true;
                    });
                });
                //zIndex
                this.posterItems.each(function(i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            } else if (dir === "right") {
                this.posterItems.each(function() {
                    var self = $(this),
                    next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                    width = next.width(),
                    height = next.height(),
                    zIndex = next.css("z-index"),
                    opacity = next.css("opacity"),
                    left = next.css("left"),
                    top = next.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex:zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    },
                    _this_.setting.speed,
                    function() {
                        _this_.rotateFlag = true;
                    });
                });
                //zIndex
                this.posterItems.each(function(i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }
        },

        /**
         * [setPosterPos ]
         * 
         */
        setPosterPos: function() {
            var self = this; 
            var sliceItems = this.posterItems.slice(1),
            sliceSize = sliceItems.size() / 2,
            rightSlice = sliceItems.slice(0, sliceSize),
            //z-index 
            level = Math.floor(this.posterItems.size() / 2),
          
            leftSlice = sliceItems.slice(sliceSize);
            var rw = this.setting.posterWidth, 
            rh = this.setting.posterHeight,
            gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
            var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
            var fixOffsetLeft = firstLeft + rw; 
            rightSlice.each(function(i) {
                level--;
                rw = rw * self.setting.scale; 
                rh = rh * self.setting.scale; 
                var j = i;
                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / (++j),
                    // 1、1/1 2、1/2 
                    left: fixOffsetLeft ,
                    top: self.setVerticalAlign(rh)
                });
            });
            /**
             * @param  {[type]} 
             * @return {[type]}    [description]
             */
            var lw = rightSlice.last().width(),
            lh = rightSlice.last().height(),
            oloop = Math.floor(this.posterItems.size() / 2);
            
            leftSlice.each(function(i) {

                $(this).css({
                    zIndex: i,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    // 1、1/1 2、1/2 
                    left: 0,
                    top: self.setVerticalAlign(lh)
                    //(self.setting.height - lh)/2 	
                });
                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;
                oloop--;
            });
        },
        /**
         * [setVerticalAlign ]
         * @param {[type]} height 
         * 
         */
        setVerticalAlign: function(height) {
            var verticalType = this.setting.verticalAlign,
            top = 0;
            if (verticalType === "middle") {
                top = (this.setting.height - height) / 2;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType === "bottom") {
                top = this.setting.height - height;
            } else {
                top = (this.setting.height - height) / 2;
            };

            return top;
        },

        /**
         * [setSettingValue ]
         * 
         */
        setSettingValue: function() {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height,
                zIndex: this.posterItems.size() / 2,
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height,

            });
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            //alert(this.posterItems.size()/2);
            this.prevBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2),
            });
            this.nextBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2),
            });
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: w,
                zIndex: Math.floor(this.posterItems.size() / 2),
            });
        },
        getSetting: function() {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return [];
            }
        }
    };
    Carousel.init = function(posters,option) {
        var _this_ = this;
        posters.each(function() {
            new _this_($(this),option);
        });
    };
    window.Carousel = Carousel;
})(jQuery);
