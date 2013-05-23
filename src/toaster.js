;(function($, window) {
	'use strict';

	var toaster = function(options) {
		var
			instance = {},
			shownQueue = [],
			waitingQueue = []
			;

		options = $.extend({
			hover: false,
			maxToastShow: 5
		}, options);

		if (!options.$el) {
			options.$el = $('<div />');
			options.$el.addClass('class', 'toaster-group');
			$('body').append(options.$el);
		}

		function showToast(toast) {
			options.$el.prepend(toast.$el);
			toast.init();

			toast.on('mouseover', function() {
				instance.stopToasts();
			});

			toast.on('mouseout', function() {
				instance.playToasts();
			});

			shownQueue.push(toast);
		}

		instance.stopToasts = function() {
			$.each(shownQueue, function(toast) {
				toast.stop();
			});
		};

		instance.playToasts = function() {
			$.each(shownQueue, function(toast) {
				toast.play();
			});
		};

		instance.push = function(toast) {
			toast.on('hide', function() {
				this.destroy();
				showToast(waitingQueue.shift());
			});

			if (shownQueue.length < options.maxToastShow) {
				showToast(toast);
			} else {
				waitingQueue.push(toast);
			}
		};

		return instance;
	};

	var toast = function($el, options) {
		var
			instance = {},
			$instance = $(instance),
			timer,
			$closeBtn
			;

		options = $.extend({
			duration: 3000,
			effectDuration: 'fast',
			closeBtn: 'close-button'
		}, options);

		instance.init = function() {
			$closeBtn = $el.find('.'+options.closeBtn);

			/**
			 * Bind events
			 */
			$closeBtn.click(function(e) {
				instance.hide();
				return false;
			});

			$el.on('mouseover', function() {
				instance.trigger('mouseover');
			});

			$el.on('mouseout', function() {
				instance.trigger('mouseout');
			});

			this.show();
		};

		instance.show = function() {
			$el.addClass('show');
		};

		instance.hide = function() {
			$el.removeClass('show');
			instance.trigger('hide');
		};

		instance.stop = function() {
			if (timer) {
				window.clearTimeout(timer);
			}
		};

		instance.play = function() {
			if (timer) {
				window.clearTimeout(timer);
			}

			timer = window.setTimeout(function() {
				instance.hide();
			}, options.duration);
		};

		instance.destroy = function() {
			$el.off();
			$closeBtn.off();
		};

		instance.on = function(name, callback) {
			$instance.on(name, callback);
			return this;
		};

		instance.trigger = function(name) {
			$instance.trigger(name);
		};

		instance.$el = $el;

		return instance;
	};

	toast.makeFromNotification = function(notification) {
		var
			$toast = $('<div class="toast"><div class="toast-header"><a class="close-button" href="#"><span class="ui-icon ui-icon-close"></span></a></div></div>'),
			message = $('<div class="toast-message" />')
				.append(notification.message),
			image = $('<img width="50" height="50" class="toast-image" />')
				.attr('src', notification.image)
			;

		$toast
			.data('id',notification.id)
			.append(image)
			.append(message)
			;

		return toast($toast);
	};

}(jQUery, window));
