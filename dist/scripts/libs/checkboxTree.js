(function($){
    $.fn.checkboxTree = function() {
        var $self = $(this);
        var $item = $self.find('li');
        //добавить класс для всех вложеных списков
        var $innerList = $item.find('ul').addClass('p-inner-list');

        var checkbox = 'input:checkbox';

        $self.addClass('p-checkbox-tree-container');
        //скрыть все внутренние списки
        //$innerList.hide();

        //для li в котором есть ul добавить класс 
        if($innerList.length){
            $innerList.parent('li').addClass('p-parent-item');
        }

        var $parent = $('.p-parent-item');
        //все чекбоксы в родительской li
        var $parentInput = $parent.find(checkbox);
        
        //элемент развернуть/свернуть дерево элементов
        $parent.find('>.b-checkbox').prepend('<span class="p-toggle-tree"></span>');

        $('.p-toggle-tree').on('click', function(){
            var $list = $(this).closest('.p-parent-item').find('>ul');

            $(this).toggleClass('p-toggle-tree_active');
            $list.toggleClass('p-inner-list');

            if($list.hasClass('p-inner-list')) {
                $list.slideUp();
            }else{
                $list.slideDown();
            }
        });
                
        //переключение инпутов
        $self.find(checkbox).on('change', function(){

            var inputState = $(this).is(':checked');

            var innerNotChecked = $(this).closest('.p-parent-item ul').find(checkbox).filter(':not(:checked)').length;


            if($(this).closest('li').hasClass('p-parent-item')) {
                $(this).closest('.p-parent-item').find(checkbox).prop('checked', inputState);
            }
            //проверка состояния checked/unchecked инпутов. Источник багов может быть в этом месте
            if(innerNotChecked && !$(this).parents('.b-checkbox').next().length) {
                $(this).closest('.p-parent-item').find('>.b-checkbox').find(checkbox).prop('checked', false);
            }
            if(!innerNotChecked && !$(this).parents('.b-checkbox').next().length) {
                $(this).closest('.p-parent-item').find('>.b-checkbox').find(checkbox).prop('checked', true);
            }
            
        });
    };
})(jQuery);