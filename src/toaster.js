;(function($, window) {
	'use strict';

	var eventable = function(obj) {
		var events = {};
		obj = obj || {};

		obj.on = function(name, fn) {
			events[name] = events[name] || [];
			events[name].push(fn);
			return obj;
		};

		obj.off = function(name, fn) {
			if(!(name in events)) { return; }
			if (fn) {
				events[name].splice(events[name].indexOf(fn), 1);
			} else {
				events[name] = [];
			}
			return obj;
		};

		obj.trigger = function(name) {
			if(!(name in events)) { return; }

			for(var i = 0; i < events[name].length; i++){
				events[name][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
			return obj;
		};

		return obj;
	};

	var toaster = function(options) {
		var
			instance = eventable(),
			shownQueue = [],
			waitingQueue = []
			;

		options = $.extend({
			hover: false,
			maxToastShow: 5,
			cls: 'toaster-group'
		}, options);

		if (!options.$el) {
			options.$el = $('<div />');
			options.$el.addClass(options.cls);
			$('body').append(options.$el);
		}

		instance.options = options;

		function showToast(toast) {
			options.$el.prepend(toast.$el);
			toast.init();

			toast.on('hide', function() {
				this.destroy();

				instance.showNextToastInWaiting();
			});

			toast.on('mouseover', function() {
				instance.stopToasts();
			});

			toast.on('mouseout', function() {
				instance.playToasts();
			});

			shownQueue.push(toast);
		}

		instance.stopToasts = function() {
			$.each(shownQueue, function() {
				this.stop();
			});
		};

		instance.playToasts = function() {
			$.each(shownQueue, function() {
				this.play();
			});
		};

		instance.showNextToastInWaiting = function() {
			var toast = waitingQueue.shift();

			if (toast) {
				showToast(toast);
			}
		};

		instance.push = function(toast) {
			if (shownQueue.length < options.maxToastShow) {
				showToast(toast);
			} else {
				waitingQueue.push(toast);
			}
		};

		instance.shownQueueLength = function() {
			return shownQueue.length;
		};

		instance.waitingQueueLength = function() {
			return waitingQueue.length;
		};

		instance.hasToast = function(toast) {
			return Boolean(options.$el.find(toast.$el).length);
		};

		instance.destroy = function() {
			options.$el.remove();
		};

		return instance;
	};

	toaster.toast = function($el, options) {
		var
			instance = eventable(),
			timer,
			$closeBtn
			;

		options = $.extend({
			duration: 3000,
			effectDuration: 'fast',
			closeBtn: '.toaster-toast-close-button'
		}, options);

		instance.options = options;

		instance.init = function() {
			$closeBtn = $el.find(options.closeBtn);

			/**
			 * Bind events
			 */
			$closeBtn.on('click', function(e) {
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
			this.trigger('hide');
		};

		instance.stop = function() {
			if (timer) {
				window.clearTimeout(timer);
			}

			return this;
		};

		instance.play = function() {
			this.stop();

			timer = window.setTimeout(function() {
				instance.hide();
			}, options.duration);
			return this;
		};

		instance.destroy = function() {
			$closeBtn.off();
			$el.off();
			$el.remove();
		};

		instance.$el = $el;

		return instance;
	};

	window.toaster = toaster;
}(jQuery, window));
