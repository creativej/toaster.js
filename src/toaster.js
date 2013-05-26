;(function($, window, document) {
	'use strict';

	/**
	 * Polyfill indexOf
	 */
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj, fromIndex) {
			if (fromIndex == null) {
				fromIndex = 0;
			} else if (fromIndex < 0) {
				fromIndex = Math.max(0, this.length + fromIndex);
			}
			for (var i = fromIndex, j = this.length; i < j; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		};
	}

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
				instance.removeToast(this);
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

		instance.removeToast = function(toast) {
			toast.destroy();

			var index = shownQueue.indexOf(toast);
			if (index !== -1) {
				shownQueue.splice(index, 1);
			}
		};

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

	toaster.toast = function(options) {
		options = $.extend({
			toast: null,
			content: '',
			duration: 4000,
			transitionDuraion: 750,
			fallIntoPositionDuration: 300,
			effectDuration: 'fast',
			closeBtn: 'x',
			closeBtnClass: 'toaster-toast-close-button',
			contentClass: 'toaster-toast-message'
		}, options);

		var toast = options.toast ||
'<div class="toaster-toast">' +
'	<a class="' + options.closeBtnClass + '" href="#">' + options.closeBtn + '</a>' +
'	<div class="' + options.contentClass + '">' +
'	</div>' +
'</div>'
;
		var
			instance = eventable(),
			timer,
			$closeBtn,
			$el = $(toast),
			$content = $el.find('.' + options.contentClass)
			;

		$content.html(options.content);

		instance.options = options;

		instance.init = function() {
			$closeBtn = $el.find('.' + options.closeBtnClass);

			/**
			 * Bind events
			 */

			if ($closeBtn.length) {
				$closeBtn.on('click', function(e) {
					instance.hide();
					return false;
				});
			}

			$el.on('mouseover', function() {
				instance.trigger('mouseover');
			});

			$el.on('mouseout', function() {
				instance.trigger('mouseout');
			});

			instance.show();
			instance.play();
		};

		instance.setContent = function(content) {
			$content.html(options.content);
			return this;
		};

		instance.show = function() {
			$el.animate({
				opacity: 1,
				top: "0px"
			}, this.options.transitionDuraion);
		};

		instance.hide = function() {
			$el.animate({
				opacity: 0,
				top: "20px"
			}, this.options.transitionDuraion).animate({
				height: "0px"
			}, this.options.fallIntoPositionDuration, function() {
				instance.trigger('hide');
			});
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
			if ($closeBtn) {
				$closeBtn.off();
			}

			$el.off();
			$el.remove();
		};

		instance.$el = $el;

		return instance;
	};

	window.toaster = toaster;
}(jQuery, window, document));
