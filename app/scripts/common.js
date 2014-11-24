var PKP = {};

PKP.init = function() {
    PKP.$window        = $(window);
    PKP.$document      = $(document);
    PKP.$body          = $('body');

    /* Включаем модули */
    PKP.UI.init();
    PKP.Tip.init();

    PKP.$window.on('load resize', function() {
        PKP.windowHeight     = PKP.$window.height();
        PKP.windowWidth      = PKP.$window.width();
        PKP.windowScrollTop  = PKP.$window.scrollTop();
        PKP.windowScrollLeft = PKP.$window.scrollLeft();
        // PKP.Responsive.reflow();
    });
};

/* Элементы интерфейса */
PKP.UI = {
    init: function() {
        PKP.UI.dropdowns();
        PKP.UI.sidebar();

    },

    dropdowns: function() {
        /* «Выпадайка» */
        PKP.$body.on("click", '.dropdown__trigger', function(e) {
            e.preventDefault();
            var $this = $(this);

            if($this.is('.disabled')) {
                return false;
            }

            if(0 < $('.dropdown__trigger.active').length) {
                $('.dropdown__trigger.active')
                    .not(this).removeClass('active')
                    .closest('.dropdown')
                    .find('.dropdown__content').addClass('hidden');   
            }
            
            $this
                .toggleClass('active')
                .closest('.dropdown')
                .find('.dropdown__content[data-target="' + $this.data('target') + '"]')
                .toggleClass('hidden');
        });

        /* Скрываем выпадайку по клику мимо неё */
        PKP.$document.click(function(e) {
            var $this = $(e.target);

            if($this.is('.dropdown__trigger')) {
                //
            } else {
                if(1 !== $this.parents().filter('.dropdown__content').length) {
                    $('.dropdown__trigger.active').
                        removeClass('active').
                        siblings('.dropdown__content').addClass('hidden');
                }
            }
        });

        /* По клику на внутреннюю ссылку «выпадайка» закрывается */
        PKP.$body.on("click", '.dropdown__content a', function() {
            $(this).
                closest('.dropdown__content').toggleClass('hidden').
                siblings('.dropdown__trigger').toggleClass('active');
        });

        /* Табы */
        PKP.$body.on("click", '.tab__trigger', function() {
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
        //$('.menu-item--openable').on('click', function() {$(this).toggleClass('active');})

        $(window).resize(function() {
            navigation_onresize();
        });

        function onload(){
            navigation_onresize();    
        }

        function navigation_onresize() {
            
            var inner_port = window.innerWidth || $(document).width();
            
            if(inner_port < 1025) {               
                $(".b-sidebar .b-sidebar-navigation").removeClass("b-sidebar-navigation--minimized");
                $(".page-container").removeClass("page-container--wide");
                $(".b-sidebar .b-sidebar-navigation li.active").removeClass("active");

                console.log(inner_port);
                
                        
                $(".b-sidebar-navigation--horizontal").each(function(){            
                    if(!$(this).hasClass("b-sidebar-navigation--panel")){                
                        $(".b-sidebar-navigation--horizontal").addClass("b-sidebar-navigation--h-holder").removeClass("b-sidebar-navigation--horizontal");
                    }
                });
                
            } else {        
                if($(".page-navigation-toggled").length > 0){
                    navigation_minimize("close");
                }               
            }

            console.log('resized');     
        }

        function navigation_minimize(action) {
            if(action == 'open') {
                $(".page-container").removeClass("page-container--wide");
                $(".b-sidebar .b-sidebar-navigation").removeClass("b-sidebar-navigation--minimized");
            }
            
            if(action == 'close') {
                $(".page-container").addClass("page-container--wide");
                $(".b-sidebar .b-sidebar-navigation").addClass("b-sidebar-navigation--minimized");
            }
            
            $(".b-sidebar-navigation li.active").removeClass("active");
        }

        function navigation() {
            $(".b-sidebar-navigation--control").click(function() {
                $(this).parents(".b-sidebar-navigation").toggleClass("b-sidebar-navigation--open");
                navigation_onresize(); 
                return false;
            });

            if($(".page-navigation-toggled").length > 0) {
                navigation_minimize("close");
            }
            

            $('#js-togglenav').click(function() {
                if($(".b-sidebar .b-sidebar-navigation").hasClass("b-sidebar-navigation--minimized")){
                    $(".page-container").removeClass("page-navigation--toggled");
                    navigation_minimize("open");

                } else {            
                    $(".page-container").addClass("page-navigation--toggled");
                    navigation_minimize("close"); 
                }
                navigation_onresize();  
                return false;        
            });

               
            $(".b-sidebar-navigation li > a").click(function() {
                var li = $(this).parent('li').siblings().removeClass("active");
            });

            
            $(".b-sidebar-navigation li").click(function(event) {
                event.stopPropagation();
                
                var li = $(this);
                        
                if(li.children("ul").length > 0 || li.children(".panel").length > 0 || $(this).hasClass("xn-profile") > 0) {
                    if(li.hasClass("active")) {
                        li.removeClass("active");
                        li.find("li.active").removeClass("active");
                    } else {
                        li.addClass("active");
                    }
                        
                    navigation_onresize();
                    
                    if($(this).hasClass("xn-profile") > 0)
                        return true;
                    else
                        return false;
                }                                     
            });
            
            /* XN-SEARCH */
            $(".b-sidebar-search").on("click", function(){
                $(this).find("input").focus();
            });
        }
        navigation();
    }
}

PKP.Tip = {
    init: function() {

        $('[rel="tooltip"]').tooltip();

        // First tooltip (button)
        $(".btn.btn-support").tooltip({
            content: 'Loading...',
            updateAnimation: false,
            interactive: true,
            contentAsHTML: true,
            position: 'bottom-left',
            positionTracker: true,
            interactiveTolerance: 2000,
            // autoClose: false,
            offsetX: -20,
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
                // console.log('The tooltip has closed.');
            }
        });

        PKP.$body.on("click", '.tooltip__close', function(e) {
            var $this = $(this);

            $('.tooltiped').tooltip('hide');
        });
    }
}


/* Поехали! */
$($.proxy(PKP.init, PKP));

