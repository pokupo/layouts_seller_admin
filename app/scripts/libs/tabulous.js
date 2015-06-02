/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "tabulous",
        defaults = {
            effect: 'scale'
        };


    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var links = this.$elem.find('.p-tabs__btn');
            var firstchild = this.$elem.find('li:first-child').find('.p-tabs__btn');
            var firstdiv = this.$elem.find('.p-tabs__container');
            var tab_content;
            if (this.options.effect == 'scale') {
               tab_content = firstdiv.find('.p-tabs__content').not(':nth-child(1)').addClass('hidescale');
            } else if (this.options.effect == 'slideLeft') {
               tab_content = firstdiv.find('.p-tabs__content').not(':nth-child(1)').addClass('hideleft');
            } else if (this.options.effect == 'scaleUp') {
               tab_content = firstdiv.find('.p-tabs__content').not(':nth-child(1)').addClass('hidescaleup');
            } else if (this.options.effect == 'flip') {
               tab_content = firstdiv.find('.p-tabs__content').not(':nth-child(1)').addClass('hideflip');
            }
            var firstdivheight = firstdiv.find('.p-tabs__content').eq(0).height();

            var alldivs = this.$elem.find('.p-tabs__content');

            firstchild.addClass('p-tabs__btn_active');

            

            links.bind('click', {myOptions: this.options}, function(e) {
                e.preventDefault();

                var $options = e.data.myOptions;
                var effect = $options.effect;

                var mythis = $(this);
                var thisform = mythis.parent().parent().parent();
                var thislink = mythis.attr('href');


                firstdiv.addClass('transition');

                links.removeClass('p-tabs__btn_active');
                mythis.addClass('p-tabs__btn_active');
                thisdivwidth = thisform.find('div'+thislink).height();

                if (effect == 'scale') {
                    alldivs.removeClass('showscale').addClass('make_transist').addClass('hidescale');
                    thisform.find('div'+thislink).addClass('make_transist').addClass('showscale');
                } else if (effect == 'slideLeft') {
                    alldivs.removeClass('showleft').addClass('make_transist').addClass('hideleft');
                    thisform.find('div'+thislink).addClass('make_transist').addClass('showleft');
                } else if (effect == 'scaleUp') {
                    alldivs.removeClass('showscaleup').addClass('make_transist').addClass('hidescaleup');
                    thisform.find('div'+thislink).addClass('make_transist').addClass('showscaleup');
                } else if (effect == 'flip') {
                    alldivs.removeClass('showflip').addClass('make_transist').addClass('hideflip');
                    thisform.find('div'+thislink).addClass('make_transist').addClass('showflip');
                }               

            });

           


    
            
        },

        yourOtherFunction: function(el, options) {

        }
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( this, options );
        });
    };

})( jQuery, window, document );