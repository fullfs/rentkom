// Это типа document ready
$(function() {

    $('.b-form__form').each(function() {
        var $form = $(this);

        $form.on('submit', function(e) {
            var valid = true;
            $form.find('.b-form__input, .b-form__select, .b-form__textarea')
                .filter('._required').each(function() {
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
        });
    });


    var toggleSelectEmpty = function($el) {
        if (!$el.val()) {
            $el.addClass('_empty');
        } else {
            $el.removeClass('_empty');
        }
    }
    $('.b-form__select').each(function() {
        var $el = $(this);
        toggleSelectEmpty($el);

        $el.on('change', function() {
            toggleSelectEmpty($el);
        });
    });




});
