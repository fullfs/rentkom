// Это типа document ready
$(function() {

	var setHeaderIndent = function () {
		var $header = $('.header');
		if ($(window).scrollTop() > 70) {
			$header.css('top', 0);
		} else {
			$header.css('top', 70);
		}
	};

	$(window).scroll(setHeaderIndent);
	setHeaderIndent();


    /* Бронирование - begin */
    // Временно. Для разработки
	// for (var i = 50; i >= 0; i--) {
	// 	$('.pick-date__list').append($('.pick-date__item').last().clone());
	// };


    // ==============================
    // Подготавливаем элементы дат для работы с каруселью

    // Количество элементов на 1 слайд
    var slideSize = 12;

    var $list = $('.pick-date__list');
    $('.pick-date__item').each(function() {
        var $el = $(this);
        var $holder = $list.find('.pick-date__item-h').last();

        if (!$holder.length || $holder.find('.pick-date__item').length === slideSize) {
            $holder = $('<li class="pick-date__item-h"></li>');
            $list.append($holder);
        }

        $holder.append($el);
    });

    $list.addClass('_ready');
    // ==============================





    var $datesCarousel = $('.pick-date__inner');
    $datesCarousel.jcarousel({
        wrap: 'both'
    });

    $('.pick-date__controls-prev').on('click', function() {
        $datesCarousel.jcarousel('scroll', '-=1');
    });

    $('.pick-date__controls-next').on('click', function() {
        $datesCarousel.jcarousel('scroll', '+=1');
    });



    /* Time handing - begin */
    var $timeBox = $('.reserve-form__time');
    var $timeRowTpl = $('.reserve-form__time-item').detach();


    var getTimeTable = function(date) {
        // var timeSelected = $timeBox.find('input:checked').val();

        if (!date) {
            return;
        }

        $.ajax({
            url: '/include/ajax/getTimeByDate.php',
            data: {
                date: date
            },
            dataType: 'json',
            success: function(data) {
                var $item;
                $timeBox.empty().hide();
                if (data.STATUS) {
                    $timeBox.show();
                    for (var i = 0; i < data.ITEMS.length; i++) {
                        $item = $timeRowTpl.clone();
                        $item.find('.reserve-form__time-input').val(data.ITEMS[i].name);
                        $item.find('.reserve-form__time-text').text(data.ITEMS[i].name);

                        if (data.ITEMS[i].isAvailable === 'false') {
                            $item.addClass('_not-available');
                        }

                        // if (timeSelected === data.ITEMS[i].name) {
                        //     $item.find('.reserve-form__time-input').attr('checked', 'checked');
                        // }

                        $timeBox.append($item);
                    }
                } else {
                    $timeBox.show().append('<div>' + data.ERROR + '</div>')
                }
            }
        })
    }

    getTimeTable(
        $('.reserve-form__hidden._date').val()
    );

	$('.pick-date__item:not(._not-available)').click(function() {
		var $el = $(this);
        var id = $el.data('id');
        var date = $el.data('date');

		$('.pick-date__item').removeClass('_active');
		$el.addClass('_active');

        $('.reserve-form__hidden._id').val(id);
        $('.reserve-form__hidden._date').val(date);

        getTimeTable(date);

	});
    /* Time handing - end */


    $('.reserve-form__select').select2({
        minimumResultsForSearch: -1
    });





    $('.reserve-form__form').submit(function(e) {
        var isValid = true;
        $(this).find('input, select, textarea').each(function() {
            var $el = $(this);

            if (
                !$el.val() &&
                !$el.closest('.select2-container').length &&
                !$el.closest('.reserve-form__time').length &&
                !$el.is('[type="hidden"')
            ) {
                isValid = false;
                $el.addClass('_invalid');

                if ($el.data('invalidTimeout')) {
                    clearTimeout($el.data('invalidTimeout'));
                    $el.data('invalidTimeout', null);
                }

                var time = setTimeout(function() {
                    $el.removeClass('_invalid');
                }, 3000);

                $el.data('invalidTimeout', time);

            }
        });

        
        var $timeHolder = $('.reserve-form__time-h');
        clearTimeout($timeHolder.data('invalidTimeout'));
        $('.reserve-form__time-error').remove();
        if (!$('.reserve-form__time-input:checked').length) {
            isValid = false;
            var time = setTimeout(function() {
                $('.reserve-form__time-error').remove();
            }, 3000);

            $timeHolder.data('invalidTimeout', time);
            $timeHolder.append('<p class="reserve-form__time-error">' + $('.reserve-form__time-h').data('error-text') + '</p>');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });
                            
    /* Бронирование - end */

});