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
    PKP.mobile.init();
    PKP.$window.on('load resize', function() {
        PKP.windowHeight     = PKP.$window.height();
        PKP.windowWidth      = PKP.$window.width();
        PKP.windowScrollTop  = PKP.$window.scrollTop();
        PKP.windowScrollLeft = PKP.$window.scrollLeft();
    });
};

PKP.mobile = {
    init: function(){
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone/i);
            },
            iOSFull: function(){
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            },
            anyFull: function(){
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOSFull() || isMobile.Opera() || isMobile.Windows());
            }
        };
        if(isMobile.any()) {
           $('body').addClass('mobile');
           $('.j-breadcrumbs__item').css({
                'max-width': $(window).width() - 135 - $('.m-breadcrumbs__item_active').width()
           });
           window.addEventListener('resize', function() {
                setTimeout(function(){
                    $('.j-breadcrumbs__item').css({
                        'max-width': $(window).width() - 135 - $('.m-breadcrumbs__item_active').width()
                    });
                }, 200);
            }, false);
        }
        if(isMobile.anyFull()) {
           $('body').addClass('mobile_full');
        }
    }
};
/* Элементы интерфейса */
PKP.UI = {
    init: function() {
        PKP.UI.scroll();
        PKP.UI.goods();
        PKP.UI.popup();
        PKP.UI.common();
        PKP.UI.profile();
        PKP.UI.dropdowns();
        PKP.UI.charts();
        PKP.UI.sidebar();
        PKP.UI.calendar();
        PKP.UI.tabs();
        PKP.UI.mini();    
        PKP.UI.tinymce();
        PKP.UI.select();
        PKP.UI.rubricator();
    },
    profile: function(){
        //табы для страницы Профиля
        $('.j-profile-tabs').each(function(){
            $(this).find('.b-profile-menu__item').on('click', function(){
                var $self = $(this),
                    attr = $self.data('some'),
                    prev = $self.prevAll(),
                    visibleTabId = $('.b-profile').children().filter(':visible').data('tab');

                $self.siblings().removeClass('m-profile-menu__item_previous-steps');
                prev.andSelf().find('.b-profile-menu__icon').removeClass('m-profile-menu__icon_not-verified');
                $self.nextAll().find('.b-profile-menu__icon').addClass('m-profile-menu__icon_not-verified');
                prev.addClass('m-profile-menu__item_previous-steps');

                if(visibleTabId!=attr){
                    $('.b-profile').children().each(function(){
                        $(this).slideUp(400, function() {
                            $(this).filter('[data-tab="'+attr+'"]').slideDown();
                        });
                    });
                }

            });
        });
        //Закрытие предупреждения
        $('.j-warning-close').on('click', function(){
            var warningBlock = $(this).parent(),
                warningBlockHeight = warningBlock.outerHeight();
            $(this).parent().animate({
                'margin-top': -warningBlockHeight
            },{
                duration: 250,
                complete: function(){
                    $(this).remove();
                }
            });
        });
    },
    tinymce: function(){
        //tinymce editor    
        tinymce.init({
            menubar:false,
            selector: '.tinymce',
            language: 'ru',
            plugins: [
                'advlist fullpage autolink lists charmap print preview anchor',
                'link anchor image media code insertdatetime preview textcolor searchreplace',
                'table hr charmap emoticons print fullscreen directionality visualchars spellchecker pagebreak nonbreaking visualblocks'
            ],
            toolbar1: 'newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect',
            toolbar2: 'cut copy paste | searchreplace | bullist numlist | indent outdent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor',
            toolbar3: 'table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | visualchars | spellchecker | visualchars visualblocks nonbreaking pagebreak |'
        });
    },
    goods: function(){
        //блок "Изображения". Возможность редактирования описания к товару
        $('.j-goods-desc').on('click', function(e){
            $(this).parents('.b-images__item').addClass('m-images__item_active').find('.j-editable').focus();
        });
        $('.j-editable').on('keyup', function(){
            var lettersAmount = $(this).text().length,
                limit = 50,
                str = $(this).text(),
                extraText = str.substring(limit,lettersAmount),
                allowedText = str.substring(0,limit);

            var $countContainer = $(this).parents('.b-images__item').find('.j-letters-count');

            if(lettersAmount > limit) {
                $(this).addClass('m-images__editable-block_error').html(allowedText + '<span>' + extraText + '</span>');
                var span = $(this).find('span');
                var sel = window.getSelection();
                sel.collapse(span[0], 1);
                $countContainer.addClass('m-images__letters-count_error').text(lettersAmount - limit);
            }else{
                $(this).removeClass('m-images__editable-block_error');
                $countContainer.removeClass('m-images__letters-count_error').text(limit - lettersAmount);
            }
        }).on('focusout', function(){
            if($(this).text().length!==0){
                $(this).parents('.b-images__item').find('.b-images__description-text').empty().text($(this).text());
            }
            $(this).parents('.b-images__item').removeClass('m-images__item_active');
        });
    },
    scroll: function(){
        //Кастомный  скролл
        $('.j-scrollbar').mCustomScrollbar();//скролл для меню слева
        $('.j-scroll').each(function(i,e){
            var $self = $(this);
            var options = {
                position: $self.data('scroll-position'),
                theme: $self.data('scroll-theme'),
                axis: $self.data('axis')
            };
            $self.mCustomScrollbar({
                scrollbarPosition: options.position,
                axis: options.axis,
                theme: options.theme
            });
        });
    },
    tabs: function(){
        $('.j-tabs').tabulous({
            effect: 'scale'
        });
    },
    calendar: function(){
        //Календарь на главной странице админки
        $('.j-calendar__range-start,.j-calendar__range-end').datepick($.extend({
            firstDay: 1,
            dateFormat: 'dd.mm.yyyy',
            showOtherMonths: true,
            nextText: '',
            prevText: '',
            changeMonth: false,
            onSelect: customRange,
        },
            $.datepick.regionalOptions['ru']
        ));
        function customRange(dates) { 
            if ($(this).hasClass('j-calendar__range-start')) { 
                $('.j-calendar__range-end').datepick('option', 'minDate', dates[0] || null); 
            } 
            else { 
                $('.j-calendar__range-start').datepick('option', 'maxDate', dates[0] || null); 
            } 
        }
    },
    popup: function(){
        // Попапы
        $('.j-popup-trigger').on('click', function(){
            var $self = $(this);
            var popup = $self.data('popup');
            $('.'+popup).arcticmodal();
            return false;
        });
        // Закрытие попап
        $('.j-modal-close').on('click', function(){
            $.arcticmodal('close');
        });
    },
    select: function(){
        //селект с тегами
        $('.j-select-tags').select2({
            tags: true,
            tokenSeparators: [','],
        });
        // Кастомный селкт
        $('.j-select').dropdown();
    },
    dropdowns: function() {
        //dropdown tree
        $('.b-select-tree__head').on('click', function(){
            var $self = $(this),
                $content = $self.parent().find('.b-select-tree__content');
            if($content.is(':visible')){
                $content.hide();
            }else{
                $content.show();
            }
        });
        // «Выпадайка» 
        PKP.$body.on('click', '.j-dropdown__trigger', function(e) {
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
        PKP.$document.on('click', function(e) {
            var $this = $(e.target);
            if(!$this.is('.b-dropdown__trigger')) {
                $('.b-dropdown__trigger.active').removeClass('active').siblings('.b-dropdown__content').addClass('g-hidden');
            }
            if(!$this.is('.b-select-tree *')) {
                $('.b-select-tree__content').hide();
            }
        });

        /* По клику на внутреннюю ссылку «выпадайка» закрывается */
        PKP.$body.on('click', '.b-dropdown__content a', function() {
            $(this).
                closest('.b-dropdown__content').toggleClass('g-hidden').
                siblings('.b-dropdown__trigger').toggleClass('active');
        });

        /* Снимаем класс ошибки при фокусе */
        $('input.error').on('focus', function() {
            $(this).removeClass('error');
            $(this).closest('.input-holder').find('.error__message').hide();
        });
    },
    sidebar: function() {
        $('.b-sidebar-navigation li > a').click(function() {
            var li = $(this).parent('li').siblings().removeClass('active');
        });

        $('.b-sidebar-navigation li').click(function(event) {
            event.stopPropagation();
            
            var li = $(this);
                    
            if( li.children('ul').length > 0 || 
                li.children('.panel').length > 0) {

                if(li.hasClass('active')) {
                    li.removeClass('active');
                    li.find('li.active').removeClass('active');
                } else {
                    li.addClass('active');
                }
                                   
                return false;
            }                                     
        });
        
        /* XN-SEARCH */
        $('.b-sidebar-search').on('click', function(){
            $(this).find('input').focus();
        });
    }, 
    charts: function(){
        var visitsChart = c3.generate({
            bindto: d3.select('.j-visits-graph'),
            size: {
              height: 255
            },
            data: {
                x: 'x',
                names: {
                    data1: 'Посетителей',
                    data2: 'Конверсия',
                },
                columns: [
                    ['x', '2015-02-27', '2015-02-28', '2015-03-01', '2015-03-02', '2015-03-03', '2015-03-04', '2015-03-05'],
                    ['data1', 0, 15, 4, 24, 7, 27, 36],
                    ['data2', 0, 7, 9, 28, 12, 30, 25]
                ],
                types: {
                    data1: 'line',
                    data2: 'area'
                },
                classes: {
                    data1: 'line-data1',
                    data2: 'area-data2',
                },
                colors: {
                    data1: '#4dbbec',
                    data2: '#4dbbec',
                }
            },
            axis: {
                x: {
                    padding : 0,
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m'
                    }
                },
                y: {
                    tick: {
                        count: 5,
                        values: [0, 10, 20, 30, 40]
                    }
                }
            },
            padding: {
                top: 21,
                right: 15,
                left: 22
            },
            tooltip: {
                show: true,
                position: function (data, width, height, element) {
                    var chartOffsetX = document.querySelector('.j-visits-graph').getBoundingClientRect().left;
                    var graphOffsetX = document.querySelector('.j-visits-graph g.c3-axis-y').getBoundingClientRect().right;
                    var someY = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width')/2) - 19;
                    var point = $(element).parents('.j-visits-graph').find('.c3-circle-' + data[0].index);

                    var graph = $('.j-visits-graph');
                    var tooltipContainer = graph.find('.c3-tooltip-container');
                    var graphSectionsLenght = graph.find('circle.c3-shape').length/2;
                    if(graphSectionsLenght===data[0].index + 1) {
                        tooltipContainer.addClass('c3-tooltip-container_last');
                        return {
                            top: (parseInt(point.attr('cy')) - height), 
                            left: (parseInt(point.attr('cx')) - tooltipContainer.outerWidth()/2 - 22)
                        };
                    }else{
                        tooltipContainer.removeClass('c3-tooltip-container_last');
                        return {
                            top: (parseInt(point.attr('cy')) - height), 
                            left: (parseInt(point.attr('cx')) - 42)
                        };
                    }
                },
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                        titleFormat = config.tooltip_format_title || defaultTitleFormat,
                        nameFormat = config.tooltip_format_name || function (name) { return name; },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {
                        if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }
                        if (! text) {
                          title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                          text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + moment(d[i].x).locale('ru').format("dd, D MMM. YYYY") + "</th></tr>" : "");
                        }
                        name = nameFormat(d[i].name);
                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                        text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                        if(i === 1) {
                            text += "<td class='name'>" + name + ":&nbsp;" + value +"%" + "</td>";
                        }else{
                            text += "<td class='name'>" + name + ":&nbsp;" + value + "</td>";
                        }
                        text += '</tr>';
                    }
                    return text + '</table>' ;
                }
            },
            legend: {
                show: false
            },
            point: {
                r: 7,
                focus: {
                    expand: {
                        r: 9
                    }
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            }
        });
        var ordersChart = c3.generate({
            bindto: '.j-orders-graph',
            size: {
              height: 255
            },
            data: {
                x: 'x',
                names: {
                    data1: 'Посетителей',
                    data2: 'Конверсия',
                },
                columns: [
                    ['x', '2015-02-27', '2015-02-28', '2015-03-01', '2015-03-02', '2015-03-03', '2015-03-04', '2015-03-05'],
                    ['data1', 0, 15, 4, 24, 7, 27, 36],
                    ['data2', 0, 7, 9, 28, 12, 30, 25]
                ],
                types: {
                    data1: 'line',
                    data2: 'area'
                },
                classes: {
                    data1: 'line-data1',
                    data2: 'area-data2',
                },
                colors: {
                    data1: '#4dbbec',
                    data2: '#4dbbec',
                }
            },
            padding: {
                top: 21,
                right: 15,
                left: 22
            },
            tooltip: {
                show: true,
                position: function (data, width, height, element) {
                    var chartOffsetX = document.querySelector('.j-orders-graph').getBoundingClientRect().left;
                    var graphOffsetX = document.querySelector('.j-orders-graph g.c3-axis-y').getBoundingClientRect().right;
                    var someY = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width')/2) - 19;
                    var point = $(element).parents('.j-orders-graph').find('.c3-circle-' + data[0].index);
                    var graph = $('.j-orders-graph');
                    var tooltipContainer = graph.find('.c3-tooltip-container');
                    var graphSectionsLenght = graph.find('circle.c3-shape').length/2;
                    if(graphSectionsLenght==data[0].index+1) {
                        tooltipContainer.addClass('c3-tooltip-container_last');
                        return {
                            top: (parseInt(point.attr('cy')) - height), 
                            left: (parseInt(point.attr('cx')) - tooltipContainer.outerWidth()/2 - 22)
                        };
                    }else{
                        tooltipContainer.removeClass('c3-tooltip-container_last');
                        return {
                            top: (parseInt(point.attr('cy')) - height), 
                            left: (parseInt(point.attr('cx')) - 42)
                        };
                    }
                },
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                        titleFormat = config.tooltip_format_title || defaultTitleFormat,
                        nameFormat = config.tooltip_format_name || function (name) { return name; },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {
                        if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }
                        if (! text) {
                          title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                          text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + moment(d[i].x).locale('ru').format("dd, D MMM. YYYY") + "</th></tr>" : "");
                        }
                        name = nameFormat(d[i].name);
                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                        text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                        if(i == 1) {
                            text += "<td class='name'>" + name + ":&nbsp;" + value +"%" + "</td>";
                        }else{
                            text += "<td class='name'>" + name + ":&nbsp;" + value + "</td>";
                        }
                        text += '</tr>';
                    }
                    return text + '</table>' ;
                }
            },
            legend: {
                show: false
            },
            point: {
                r: 7,
                focus: {
                    expand: {
                        r: 9
                    }
                }
            },
            axis: {
                y: {
                    tick: {
                        count: 5,
                        values: [0, 10, 20, 30, 40]
                    }
                },
                x: {
                    padding : 0,
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m'
                    }
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            }
        });
        var visitorsChart =c3.generate({
            bindto: '.j-visitors-graph',
            size: {
              height: 355
            },
            data: {
                columns: [
                    ['data1', 37],
                    ['data2', 63]
                ],
                type : 'donut',
                classes: {
                    data1: 'donut-new',
                    data2: 'donut-registrated',
                },
            },
            padding: {
                top: 5
            },
            legend: {
                show: false
            },
            tooltip: {
                show: false,
            },
            donut: {
                width: 60,
                label: {
                    show: true,
                    threshold: 0.1,
                    format: function (value, ratio, id) {
                        var round = Math.round(ratio*100);
                        return (round + '%');
                    }
                }
            },
            color: {
                pattern: ['#97ce68', '#efece7']
            },
        });
        var visitsGeographyChart = function(){
            var svg = d3.select(".j-visits-geography-graph")
                .append('svg')
                .append('g');

            svg.append('g')
                .attr('class', 'slices');
            svg.append('g')
                .attr('class', 'labels');
            svg.append('g')
                .attr('class', 'lines');

            var width = 230,
                height = 230,
                radius = Math.min(width, height)/2;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d.value;
                });

            var arc = d3.svg.arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 0.43);

            var outerArc = d3.svg.arc()
                .innerRadius(radius * 1.2)
                .outerRadius(radius * 1.2);

            svg.attr('transform', 'translate(' + 180 + ',' + 115 + ')');

            var key = function(d){ return d.data.label; };

            var data = [{
                        'label':'Украина', 
                        'value':23,
                        'color': '#efece7'
                    }, 
                    {
                        'label':'Белоруссия',
                        'value':29,
                        'color': '#4dbbec'
                    }, 
                    {
                        'label':'Сербия', 
                        'value':17,
                        'color': '#719f4a'
                    },
                    {
                        'label':'Россия', 
                        'value':31,
                        'color': '#97ce68'
                    }];

            change(data);


            function change(data) {
                /* ------- PIE SLICES -------*/
                var slice = svg.select('.slices').selectAll('path.slice')
                    .data(pie(data), key);

                slice.enter()
                    .insert('path')
                    .style('fill', function(d) { 
                        return d.data.color; 
                    })
                    .attr('class', 'slice');

                slice       
                    .transition().duration(1000)
                    .attrTween("d", function(d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });

                slice.exit()
                    .remove();

                /* ------- TEXT LABELS -------*/

                var text = svg.select('.labels').selectAll('text')
                    .data(pie(data), key);

                text.enter()
                    .append('text')
                    .attr({
                        'dy': '.35em'
                    })
                    .html(function(d) {                
                        return '<tspan x="0" class="labels__label">' + d.data.label + '</tspan>' + '<tspan class="labels__value" style="text-anchor:start" x="0" dy="20">' + d.data.value + '%' + '</tspan>';
                    });
                
                function midAngle(d){
                    return d.startAngle + (d.endAngle - d.startAngle)/2;
                }

                text.transition().duration(1000)
                    .attrTween('transform', function(d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * (midAngle(d2) < Math.PI ? 0.9 : -1.4);
                            return 'translate('+ pos +')';
                        };
                    })
                    .styleTween('text-anchor', function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            return midAngle(d2) < Math.PI ? 'start':'start';
                        };
                    });

                text.exit()
                    .remove();

                /* ------- SLICE TO TEXT POLYLINES -------*/

                var polyline = svg.select('.lines').selectAll('polyline')
                    .data(pie(data), key);
                
                polyline.enter()
                    .append('polyline');

                polyline.transition().duration(1000)
                    .attrTween('points', function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            return [arc.centroid(d2), outerArc.centroid(d2)];
                        };          
                    });
                
                polyline.exit()
                    .remove();
            }
        }();
    },
    common: function(){          
        $('.b-goods-table__tbody').find('input[type="checkbox"]').on('change', function(){
                var button = $(this);
                var actions = $('.b-actions');

                actions.each(function(){
                    var $self = $(this);
                    var search = $self.find('.j-actions__search').closest('.b-actions__item');
                    var minus = $self.find('.j-goods-input').closest('.b-actions__item');
                    var total = $self.find('.b-actions__item').length;

                    if(search.length) {
                        var searchPos = search.position().left;
                    }

                    minus.css({
                        'position': 'relative',
                        'z-index': 2
                    });

                    var items = $self.find('.b-actions__item').not(search).not(minus);
                            if(button.prop('checked')){
                                search.animate({
                                    'position': 'relative',
                                    'margin-left': 0,
                                    'opacity': 1
                                });
                            }else{ 
                                search.delay((total - 2)*150).animate({
                                    'position': 'relative',
                                    'margin-left': -searchPos + 70,
                                    'opacity': 1
                                });
                            } 
                        items.each(function(i,e){
                            var x = $(this).position().left;
                            if(button.prop('checked')){
                                $(e).delay(i*150).animate({
                                    'position': 'relative',
                                    'left': 0,
                                    'opacity': 1
                                });
                            }else{
                                $(e).delay(i*150).animate({
                                    'position': 'relative',
                                    'left': -x,
                                    'opacity': 0
                                });
                            }                      
                        });
                });
        });
        //Анимация появления/исчезновения блока с поиском
            $('.j-actions__search').on('click', function(){
                var $self = $(this),
                    $searchBlock = $('.j-goods-search'),
                    $overlayBlock = $('.b-goods-search__overlay'),
                    searchBlockWidth = $searchBlock.width()/2,
                    activeClass = 'm-goods-search_active',
                    duration = 500;
                if($overlayBlock.is(':animated')) {
                    return false;
                }
                if($searchBlock.hasClass(activeClass)){
                    $self.find('.b-actions__search-triangle').fadeOut();
                    $overlayBlock.stop().animate({
                        'width': searchBlockWidth + 200
                    },{
                        duration: duration,
                        easing: 'linear',
                        complete: function(){
                            $searchBlock.slideUp(duration);
                        }
                    });
                    $searchBlock.removeClass(activeClass);
                }else{
                    $self.find('.b-actions__search-triangle').fadeIn();
                    $searchBlock.stop().slideDown(duration, function(){
                        $overlayBlock.animate({
                            'width': 0
                        },{
                            duration: duration,
                            easing: 'linear',
                            complete: function(){
                                $searchBlock.addClass(activeClass);
                            }
                        });
                    });
                }
            });
        //рейтинг на странице "Отзывы о товаре"
            $('.j-rates').each(function(){
                var rating = $(this).data('rating');
                $(this).starbox({
                    average: rating,
                    buttons: 10,
                    changeable: 'once',
                    autoUpdateAverage: true,
                    ghosting: true,
                }).bind('starbox-value-moved', function(event, value) {
                    $('body').find('.tooltip__content').text('Отзыв ' + value*10 + ' из ' + 10);
                });
            });
        //Добавление класса для строки товара
            $('.j-goods-input').on('change', function(){
                var $self = $(this),
                    $row = $self.parents('.b-goods-table__row');

                if($self.prop('checked')) {
                    $row.addClass('m-goods-table__row');
                }else{
                    $row.removeClass('m-goods-table__row');
                }
            });
        //Сворачивание блока с кодом
            $('.j-code-roll-up').each(function(){
                var $self = $(this),
                    $content =  $(this).parents('.b-code').find('.b-code__content');
                    if($content.hasClass('m-code__content_hidden')){
                        $self.text('Показать');
                    }else{
                        $self.text('Скрыть код');
                    }
                $self.on('click', function(){
                    if($content.hasClass('m-code__content_hidden')){
                        $self.text('Скрыть код');
                        $content.removeClass('m-code__content_hidden');
                    }else{
                        $self.text('Показать');
                        $content.addClass('m-code__content_hidden');
                    }
                });
            });
        //Блок "Изображения" удаление элемента
            $('.j-images__remove').on('click', function(e){
                $(this).parents('.b-images__item').fadeOut(400,function(){
                    $(this).remove();
                });
                e.preventDefault();
            });
        //Сворачивание/разворачивание рубрикатора
        //Сворачивание блока c инструкцией
            $('.j-roll-instruction').each(function(){
                    var $self = $(this),
                        $content =  $(this).parents('.b-instruction').find('.b-instruction__content');
                        if($content.hasClass('hidden')){
                            $self.addClass('m-instruction__roll-up_active');
                            $self.text('Показать инструкцию');
                        }else{
                            $self.removeClass('m-instruction__roll-up_active');
                            $self.text('Скрыть инструкцию');
                        }
                    $self.on('click', function(){
                        if(!$content.is(':visible')){
                            $self.removeClass('m-instruction__roll-up_active').text('Скрыть инструкцию');
                            $content.addClass('hidden').slideDown();
                        }else{
                            $self.addClass('m-instruction__roll-up_active').text('Показать инструкцию');
                            $content.removeClass('hidden').slideUp();
                        }
                    });
                });
        //Удаление магазина партнера
            $('.j-store-delete').on('click', function(){
                $(this).parents('.b-store').slideUp(400, function(){
                    $(this).remove();
                });
            }); 
    },

    rubricator: function(){
        //Свернуть/развернуть все итемы 
            $('.j-rubricator-show-all').on('click', function(){
                $('.b-rubricator__main-list').find('ul').slideDown(600);
                $('.b-rubricator__main-list').find('.p-toggle-tree').addClass('p-toggle-tree_active');
            });
            $('.j-rubricator-hide-all').on('click', function(){
                $('.b-rubricator__main-list').find('ul').slideUp(600);
                $('.b-rubricator__main-list').find('.p-toggle-tree').removeClass('p-toggle-tree_active');
            });
        $('.j-catalog').on('click', function(){
            $(this).toggleClass('active').next('.b-catalog-tree').stop(true,false).slideToggle();
        });
        $('.b-catalog-moderation__dropdown-item').on('click', function(){
            $(this).addClass('m-catalog-moderation__dropdown-item_checked').siblings().removeClass('m-catalog-moderation__dropdown-item_checked');
            return false;
        });
        //модерация выпадайка

        $('.j-catalog-moderation-dropdown').on('click', function(e){
            $(this).toggleClass('m-catalog-moderation__dropdown_opened').parent().find('.b-catalog-moderation__dropdown-list').slideToggle();
            return false;
        });
        $('.b-catalog-moderation__status,.b-catalog-moderation,.b-editing-actions').on('click', function(){
            return false;
        });

        $('.j-catalog-tree').checkboxTree();

        $('.j-product-catalog__add-dropdown').on('click', function(){
            $(this).find('.b-product-catalog__add-dropdown').slideToggle(300);
        });
        
        $('.b-checkbox__label').on('mouseenter', function(){
            $(this).find('.b-editing-actions').css('display','inline-block');
        }).on('mouseleave', function(){
            $(this).find('.b-product-catalog__add-dropdown').hide();
            $(this).find('.b-editing-actions').css('display','none');
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
        $('.j-hint').each(function(){
            var $self = $(this);
            var option = {
                position : $self.data('position'),
                theme : $self.data('theme'),
                content : $self.data('content'),
                offsetX: $self.data('offsetx'),
                offsetY: $self.data('offsety'),
            };
            if(!option.content){
                $self.tooltip({
                    theme: option.theme,
                    position: option.position,
                    offsetX: option.offsetX,
                    interactive: true,
                    interactiveTolerance: 200000,
                    offsetY: option.offsety
                });
            }
            if(option.content) {
                $self.tooltip({
                    content: $($('.' + option.content).html()),
                    updateAnimation: false,
                    contentAsHTML: true,
                    position: option.position,
                    positionTracker: true,
                    interactive: true,
                    interactiveTolerance: 2000,
                    offsetX: option.offsetX,
                    offsetY: option.offsetY,
                    theme: option.theme,
                });
            }
        });

        // First tooltip (button)
        $('.j-another-tooltip').tooltip({
            content: 'Loading...',
            updateAnimation: false,
            interactive: true,
            contentAsHTML: true,
            position: 'right',
            positionTracker: true,
            interactiveTolerance: 2000,
            offsetX: -12,
            offsetY: ($(window).scrollTop()/2),
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
            functionReady: function(origin, tooltip) {
                if($('body').hasClass('mobile')){
                    $('.j-another-tooltip').tooltip('option', 'offsetX', '-200');
                    $('.tooltip__base').css('right','10px');
                    $('.j-another-tooltip').tooltip('reposition');
                }
            }
        });
        
        // First tooltip (button)
        $('.j-btn_support').tooltip({
            content: 'Loading...',
            updateAnimation: false,
            interactive: true,
            contentAsHTML: true,
            position: 'bottom',
            positionTracker: true,
            interactiveTolerance: 200000,
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
                        },
                        complete: function(){
                            if($('body').hasClass('mobile')){
                                $('.tooltip__base').css({
                                    'margin-top': -$('.tooltip__base').css('top')
                                });
                                $('.hummingbird-demo').css({
                                    'width':'320px',
                                });
                                $('.j-btn_support').tooltip('reposition');
                            }
                            if(($('.tooltip__content').height() > ($(window).height() - 100))  && !$('body').hasClass('mobile')){
                                $('.hummingbird-demo').css('width','800px');
                                $('.j-btn_support').tooltip('reposition');
                            }
                        }
                    });
                }
            },
            functionReady: function(origin, tooltip) {
                if($('body').hasClass('mobile')){
                    $('.hummingbird-demo').css('width','320px');
                    $('.j-btn_support').tooltip('reposition');
                }
                if(($(tooltip).height() > ($(window).height() - 100)) && !$('body').hasClass('mobile')){
                    $('.hummingbird-demo').css('width','800px');
                    $('.j-btn_support').tooltip('reposition');
                }
            }
        });
        
        PKP.$body.on('click', '.j-tooltip-close', function(e) {
            var $this = $(this);
            $('.tooltiped').tooltip('hide');
        });
        PKP.$body.on('click', function(e) {
            var $this = $(this);
            $('.tooltiped').tooltip('hide');
        });
    }
};

/* Инициализация видеоплеера */
PKP.Video = {
    init: function() {
        if($('.video-holder').length > 0) {
            var pkPlayer = videojs('intro-video', { 
                'width': '100%',
                'height': '100%',
                'controls': true, 
                'autoplay': false, 
                'preload': 'auto',
                'nativeControlsForTouch': false
            });

            $('#js-video').on('click',function () {
                PKP.$body.addClass('locked');
                $('.video-holder').fadeIn(400, function() {
                    pkPlayer.play();
                });
            });

            $('.j-close-video').on('click',function () {
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
                pl.toggleClass('g-hidden');
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
        this.player = videojs('intro-video', { 
            'width': '100%',
            'height': '100%',
            'controls': true, 
            'autoplay': false, 
            'preload': 'auto' 
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
