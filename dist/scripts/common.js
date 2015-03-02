var PKP = {};

PKP.videos = [
    {
        src: [
            'http://stream.flowplayer.org/bauhaus/624x260.webm',
            'http://stream.flowplayer.org/bauhaus/624x260.mp4',
            'http://stream.flowplayer.org/bauhaus/624x260.ogv'
        ],
        poster: 'http://flowplayer.org/media/img/demos/minimalist.jpg',
        title: 'Video 1',
        duration: '0:40'
    },
    {
        src: [
            'http://stream.flowplayer.org/night3/640x360.webm',
            'http://stream.flowplayer.org/night3/640x360.mp4',
            'http://stream.flowplayer.org/night3/640x360.ogv'
        ],
        poster: 'http://flowplayer.org/media/img/demos/playlist/railway_station.jpg',
        title: 'Video 2',
        duration: '5:30'
    },
    {
        src: [
            'http://stream.flowplayer.org/functional/624x260.webm',
            'http://stream.flowplayer.org/functional/624x260.mp4',
            'http://stream.flowplayer.org/functional/624x260.ogv'
        ],
        poster: 'http://flowplayer.org/media/img/demos/functional.jpg',
        title: 'Video 3',
        duration: '5:30'
    }
];

PKP.init = function() {
    PKP.$window        = $(window);
    PKP.$document      = $(document);
    PKP.$body          = $('body');

    /* Включаем модули */
    PKP.UI.init();
    PKP.Video.init();
    PKP.Tip.init();

    PKP.$window.on('load resize', function() {
        PKP.windowHeight     = PKP.$window.height();
        PKP.windowWidth      = PKP.$window.width();
        PKP.windowScrollTop  = PKP.$window.scrollTop();
        PKP.windowScrollLeft = PKP.$window.scrollLeft();
    });
};

/* Элементы интерфейса */
PKP.UI = {
    init: function() {
        PKP.UI.dropdowns();
        PKP.UI.sidebar();
        PKP.UI.mini();
    },
    dropdowns: function() {
        /* Кастомный скроллбар*/
        $('.j-scrollbar').mCustomScrollbar();

        /* «Выпадайка» */
        PKP.$body.on("click", '.j-dropdown__trigger', function(e) {
            e.preventDefault();
            var $this = $(this);

            if($this.is('.disabled')) {
                return false;
            }

            if($('.b-dropdown__trigger.active').length) {
                $('.b-dropdown__trigger.active')
                    .not(this).removeClass('active')
                    .closest('.b-dropdown')
                    .find('.b-dropdown__content').addClass('g-hidden');   
            }
            $this
                .toggleClass('active')
                .closest('.b-dropdown')
                .find('.b-dropdown__content[data-target="' + $this.data('target') + '"]')
                .toggleClass('g-hidden');
        });

        /* Скрываем выпадайку по клику мимо неё */
        PKP.$document.click(function(e) {
            var $this = $(e.target);
            if(!$this.is('.b-dropdown__trigger')) {
                $('.b-dropdown__trigger.active').removeClass('active').siblings('.b-dropdown__content').addClass('g-hidden');
            }
        });

        /* По клику на внутреннюю ссылку «выпадайка» закрывается */
        PKP.$body.on("click", '.b-dropdown__content a', function() {
            $(this).
                closest('.b-dropdown__content').toggleClass('g-hidden').
                siblings('.b-dropdown__trigger').toggleClass('active');
        });

        /* Табы */
        PKP.$body.on("click", '.j-tabs', function() {
            var $this = $(this);
            $this
                .siblings()
                    .removeClass('selected');
            $this
                .addClass('selected')
                .next()
                    .addClass('selected');
        });

        /* Снимаем класс ошибки при фокусе */
        $('input.error').on('focus', function() {
            $(this).removeClass('error');
            $(this).closest(".input-holder").find('.error__message').hide();
        });
    },

    sidebar: function() {
        $(".b-sidebar-navigation li > a").click(function() {
            var li = $(this).parent('li').siblings().removeClass("active");
        });

        $(".b-sidebar-navigation li").click(function(event) {
            event.stopPropagation();
            
            var li = $(this);
                    
            if( li.children("ul").length > 0 || 
                li.children(".panel").length > 0) {

                if(li.hasClass("active")) {
                    li.removeClass("active");
                    li.find("li.active").removeClass("active");
                } else {
                    li.addClass("active");
                }
                                   
                return false;
            }                                     
        });
        
        /* XN-SEARCH */
        $(".b-sidebar-search").on("click", function(){
            $(this).find("input").focus();
        });
    },

    mini: function() {
        $('.j-mobile-menu').on('click', function(){
            $(this).toggleClass('m-mobile-menu_active');
            $('.b-sidebar').toggle();
        });
    }
};

PKP.Tip = {
    init: function() {   
        // First tooltip (button)
        $(".j-another-tooltip").tooltip({
            content: 'Loading...',
            updateAnimation: false,
            interactive: true,
            contentAsHTML: true,
            position: 'right',
            positionTracker: true,
            interactiveTolerance: 2000,
            offsetX: -12,
            offsetY: 0,
            functionBefore: function(origin, continueTooltip) {
                continueTooltip();
                if (origin.data('ajax') !== 'cached') {
                    $.ajax({
                        type: 'GET',
                        dataType: 'html',
                        url: 'ajax-popup-2.html',
                        success: function(data) {
                            origin
                                .tooltip('content', data)
                                .data('ajax', 'cached');
                        }
                    });
                }
            },
            functionAfter: function(origin) {
                
            }
        });

        // First tooltip (button)
        $(".j-btn_support").tooltip({
            content: 'Loading...',
            updateAnimation: false,
            interactive: true,
            contentAsHTML: true,
            position: 'bottom-right',
            positionTracker: true,
            interactiveTolerance: 2000,
            offsetX: 20,
            offsetY: 0,
            functionBefore: function(origin, continueTooltip) {
                continueTooltip();

                if (origin.data('ajax') !== 'cached') {
                    $.ajax({
                        type: 'GET',
                        dataType: 'html',
                        url: 'ajax-popup-1.html',
                        success: function(data) {
                            origin
                                .tooltip('content', data)
                                .data('ajax', 'cached');
                        }
                    });
                }
            },
            functionAfter: function(origin) {

            }
        });

        PKP.$body.on("click", '.j-tooltip-close', function(e) {
            var $this = $(this);
            $('.tooltiped').tooltip('hide');
        });
        PKP.$body.on("click", function(e) {
            var $this = $(this);
            $('.tooltiped').tooltip('hide');
        });
    }
};

/* Инициализация видеоплеера */
PKP.Video = {
    init: function() {
        if($('.video-holder').length > 0) {
            var pkPlayer = videojs("intro-video", { 
                "width": "100%",
                "height": "100%",
                "controls": true, 
                "autoplay": false, 
                "preload": "auto" 
            });

            $('#js-video').on('click',function () {
                PKP.$body.addClass('locked');
                $('.video-holder').fadeIn(400, function() {
                    pkPlayer.play();
                });
            });

            $('.js-close-video').on('click',function () {
                $('.video-holder').fadeOut(400,function() {
                    PKP.$body.removeClass('locked');
                    pkPlayer.pause().currentTime(0);
                });
            });

            $('.js-close-playlist').on('click', function() {
                $('.b-playlist').addClass('g-hidden');
            });

            $('.js-show-playlist').on('click', function() {
                var pl = $('.b-playlist');
                pl.toggleClass('hidden');
            });
        }

        PKP.Playlist.init();
    }
};

PKP.Playlist = {
    init: function() {
        this.els = {};
        this.cacheElements();
        this.initVideo();
        this.createListOfVideos();
        this.bindEvents();
        this.overwriteConsole();
    },

    overwriteConsole: function() {
        console._log = console.log;

    },

    log: function(string) {

        console._log(string);
    },

    cacheElements: function() {
        this.els.$playlist = $('div.b-playlist ul');
        this.els.$next = $('#js-next');
        this.els.$prev = $('#js-prev');
        this.els.log = $('div.b-log > pre');
    },

    initVideo: function() {
        this.player = videojs("intro-video", { 
            "width": "100%",
            "height": "100%",
            "controls": true, 
            "autoplay": false, 
            "preload": "auto" 
        });
        this.player.playList(PKP.videos);
    },

    createListOfVideos: function() {
        var html = '';
        for (var i = 0, len = this.player.pl.videos.length; i < len; i++) {
            html += '<li class="b-playlist-item" data-videoplaylist="'+ i +'">'+
                        '<span class="b-icon video"></span>' +
                        '<span class="b-playlist-item__poster"><img src="'+ PKP.videos[i].poster +'"></span>' +
                        '<span class="b-playlist-item__title">'+ PKP.videos[i].title +'</span>' +
                        '<span class="b-playlist-item__duration">'+ PKP.videos[i].duration +'</span>' +
                    '</li>';
        }
        this.els.$playlist.empty().html(html);
        this.updateActiveVideo();
    },

    updateActiveVideo: function() {
        var activeIndex = this.player.pl.current;

        this.els.$playlist.find('li').removeClass('active');
        this.els.$playlist.find('li[data-videoplaylist="' + activeIndex +'"]').addClass('active');
    },

    bindEvents: function() {
        var self = this;
        this.els.$playlist.find('li').on('click', $.proxy(this.selectVideo,this));
        this.els.$next.on('click', $.proxy(this.nextOrPrev,this));
        this.els.$prev.on('click', $.proxy(this.nextOrPrev,this));

        this.player.on('next', function(e) {
            self.updateActiveVideo.apply(self);
        });
        this.player.on('prev', function(e) {
            self.updateActiveVideo.apply(self);
        });
        this.player.on('lastVideoEnded', function(e) {

        });
    },

    nextOrPrev: function(e) {
        var clicked = $(e.target);
        this.player[clicked.data('target')]();
    },

    selectVideo: function(e) {
        var clicked = e.target.nodeName === 'LI' ? $(e.target): $(e.target).closest('li');

        if (!clicked.hasClass('active')){
            var videoIndex = clicked.data('videoplaylist');
            this.player.playList(videoIndex);
            this.updateActiveVideo();
        }
    }
};

/* Поехали! */
$($.proxy(PKP.init, PKP));
