(function($){
    $.fn.checkboxTree = function() {
        var $self = $(this);
        var $item = $self.find('li');
        //добавить класс для всех вложеных списков
        var $innerList = $item.find('ul').addClass('p-inner-list');

        var checkbox = 'input:checkbox';

        $self.addClass('p-checkbox-tree-container');
        //скрыть все внутренние списки
        $innerList.hide();

        //для li в котором есть ul добавить класс 
        if($innerList.length){
            $innerList.parent('li').addClass('p-parent-item');
        }

        var $parent = $('.p-parent-item');
        //все чекбоксы в родительской li
        var $parentInput = $parent.find(checkbox);
        
        //элемент развернуть/свернуть дерево элементов
        $parent.each(function(i,e){
            $(e).find('.b-ckeckbox__text').first().prepend('<span class="p-toggle-tree"></span>');
        });

        $('.b-catalog-tree__text').on('click', function(e){
            $(this).closest('li').find('.p-toggle-tree').eq(0).trigger('click');
            e.preventDefault();
        });
        $('.p-toggle-tree').on('click', function(e){
            var $list = $(this).closest('.p-parent-item').find('>ul');

            if($(this).hasClass('p-toggle-tree_active')) {
                $(this).removeClass('p-toggle-tree_active');
                $list.removeClass('p-inner-list');
                $list.slideUp();
            }else{
                $(this).addClass('p-toggle-tree_active');
                $list.addClass('p-inner-list');
                $list.slideDown();
            }
            e.preventDefault();
        });
                
        //переключение инпутов
        $self.find(checkbox).on('change', function(){

            var inputState = $(this).is(':checked');           
            
            if($(this).closest('li').hasClass('p-parent-item')) {
                $(this).closest('.p-parent-item').find(checkbox).prop('checked', inputState);
            }
            
            $(this).parents('li').each(function(index, cParent){
                if(index !== 0){
                    var $chBoxs = $(cParent).find(checkbox),
                        $topBox = $chBoxs.eq(0);
                        innerNotChecked = $chBoxs.filter(':not(:checked)').length;
                    if(innerNotChecked === 1 && $topBox.prop('checked') === false){
                        $topBox.prop('checked', true);
                    }else{
                        $topBox.prop('checked', false);
                    }
                }
            });            
        });
    };
})(jQuery);