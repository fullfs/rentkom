// Это типа document ready
$(function() {

    $('.b-form__form').on('submit', function(e) {
        var valid = true;
        $('.b-form__input, .b-form__select, .b-form__textarea').filter('._required').each(function() {
            var $el = $(this);

            if (!$el.val()) {
                valid = false;
                $el.addClass('_error');

                if ($el.data('invalidTimeout')) {
                    clearTimeout($el.data('invalidTimeout'));
                    $el.data('invalidTimeout', null);
                }

                var time = setTimeout(function() {
                    $el.removeClass('_error');
                }, 3000);

                $el.data('invalidTimeout', time);
            }
        });

        if (!valid) {
            e.preventDefault();
        }
    })
    

});