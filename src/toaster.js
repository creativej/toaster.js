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

	var toast = function(options) {
		options = $.extend({
			toast: null,
			content: '',
			transitionDuraion: 500,
			effectDuration: 'fast',
			closeBtn: 'x',
			transitionTop: '20px',
			closeBtnClass: 'toaster-toast-close-button',
			contentClass: 'toaster-toast-content'
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

			// This is needed to have nice height animation
			$el.css('height', $el.height());

			instance.show();
		};

		instance.setContent = function(content) {
			$content.html(options.content);
			return this;
		};

		instance.show = function() {
			$el.animate({
				opacity: 1,
				top: "0px"
			}, {
				duration: this.options.transitionDuraion,
				queue: true
			});
		};

		instance.hide = function() {
			$el.animate({
				opacity: 0,
				top: this.options.transitionTop
			}, {
				duration: this.options.transitionDuraion,
				complete: function() {
					$el.animate({
						height: 0
					}, {
						duration: 250,
						complete: function() {
							instance.trigger('hide');
						}
					});
				}
			});
		};

		instance.destroy = function() {
			if ($closeBtn) {
				$closeBtn.off();
			}

			$el.off();
			$el.remove();
			this.trigger('destroyed');
		};

		instance.$el = $el;

		return instance;
	};

	var toaster = function(options) {
		var
			instance = eventable(),
			shownQueue = [],
			waitingQueue = [],
			timer,
			timerStart,
			timerRemaining = 0,
			timerDuration,
			corners = {
				bottomRight: 'bottom-right-corner',
				bottomLeft: 'bottom-left-corner',
				topRight: 'top-right-corner',
				topLeft: 'top-left-corner'
			}
			;

		options = $.extend({
			hover: false,
			maxToastShow: 4,
			nextToastDelay: 0,
			duration: 3000,
			delay: 500,
			corner: corners.bottomRight
		}, options);

		if (!options.$el) {
			options.$el = $('<div />');
			options.$el.addClass('toaster-group');
			options.$el.addClass('toaster-group--' + options.corner);
			$('body').append(options.$el);
			instance.$el = options.$el;
		}

		instance.options = options;

		function isLastShown(toast) {
			return shownQueue.indexOf(toast) === shownQueue.length - 1;
		}

		function showToast(toast) {
			if (
				options.corner === corners.bottomRight ||
				options.corner === corners.bottomLeft
			) {
				options.$el.prepend(toast.$el);
			} else {
				toast.options.transitionTop = '-20px';
				options.$el.append(toast.$el);
			}

			toast.init();

			toast.on('hide', function() {
				instance.removeToast(this);

				if (isLastShown(this)) {
					instance.showToastsInWaiting();
				}
			});

			shownQueue.push(toast);

			instance.reset();
		}

		instance.showToastsInWaiting = function() {
			if (!this.waitingQueueLength()) { return; }

			var newQueue = waitingQueue.splice(0, options.maxToastShow);

			$.each(newQueue, function(index) {
				window.setTimeout(instance.push, index * options.delay, this, true);
			});
		}

		instance.removeToast = function(toast) {
			toast.destroy();

			var index = shownQueue.indexOf(toast);
			if (index !== -1) {
				shownQueue.splice(index, 1);
			}
		};

		instance.hideAllVisibleToasts = function() {
			$.each(shownQueue, function() {
				this.hide();
			});
		};

		instance.newToast = function(content) {
			var newToast = toast({ content: content });
			this.push(newToast);
			return newToast;
		};

		instance.push = function(toast, forceShow) {
			if ((shownQueue.length < options.maxToastShow && !instance.waitingQueueLength()) || forceShow) {
				showToast(toast);
			} else {
				waitingQueue.push(toast);
			}
		};

		instance.stop = function() {
			if (timer) {
				if (timerDuration) {
 					timerRemaining = Math.max(timerDuration - (new Date().getTime() - timerStart), 0);
				} else {
					timerRemaining = options.duration;
				}

				window.clearTimeout(timer);
				timer = null;
			}

			return this;
		};

		instance.isPlaying = function() {
			return Boolean(timer);
		}

		instance.reset = function() {
			this.stop().play(options.duration);
		}

		instance.play = function(delay) {
			delay = delay || 0;

			timerStart = new Date().getTime();

			timerDuration = timerRemaining + delay;

			timer = window.setTimeout(function() {
				instance.hideAllVisibleToasts();
				timer = null;
				timerDuration = 0;
				timerRemaining = 0;
			}, timerDuration);

			return this;
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

		options.$el
			.on('mouseover', function() {
				instance.stop();
			})
			.on('mouseout', function(e) {
				if (!$(e.relatedTarget).closest('.toaster-group').length) {
					instance.play();
				}
			});

		return instance;
	};

	toaster.toast = toast;

	window.toaster = toaster;
}(jQuery, window, document));
