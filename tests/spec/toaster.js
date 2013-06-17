describe("The toaster", function() {
	var toaster, delay = 50;

	beforeEach(function() {
		toaster = window.toaster();
	});

	afterEach(function() {
		toaster.destroy();
		toaster = null;
	});

	it("should setup the toaster", function() {
		expect(toaster).not.toBeNull();
		expect(toaster.options).not.toBeNull();
		expect(toaster.options.$el).not.toBeNull();
	});

	it("should destroy the toaster", function() {
		toaster.destroy();
		expect($('.' + toaster.options.cls).length).toEqual(0);
	});

	it("should create and insert new toast into the toaster", function() {
		spyOn(toaster, 'push');
		var toast = toaster.newToast('');
		expect(toast.options.content).toEqual('');
		expect(toaster.push).toHaveBeenCalled();
	});

	it("should create and insert new toast into toaster with custom options", function() {
		spyOn(toaster, 'push');
		var toast = toaster.newToast('', {
			closeBtn: 'close'
		});
		expect(toast.options.closeBtn).toEqual('close');
		expect(toaster.push).toHaveBeenCalled();
	});

	it("should insert toast into the toaster", function() {
		var toast = window.toaster.toast();

		spyOn(toast, 'init');

		expect(toaster.shownQueueLength()).toEqual(0);
		toaster.push(toast);
		expect(toaster.shownQueueLength()).toEqual(1);
		expect(toast.init).toHaveBeenCalled();

		spyOn(toaster, 'stop');
		toaster.$el.trigger('mouseover');
		expect(toaster.stop).toHaveBeenCalledWith();

		spyOn(toaster, 'play');
		toaster.$el.trigger('mouseout');
		expect(toaster.play).toHaveBeenCalledWith();

		expect(toaster.hasToast(toast)).toEqual(true);

		spyOn(toaster, 'removeToast');
		toast.trigger('hide');
		expect(toaster.removeToast).toHaveBeenCalledWith(toast);
	});

	it("should play timer and execute callback", function() {
		spyOn(toaster, 'hideAllVisibleToasts');

		runs(function() {
			toaster.play();
		});

		waits(delay);

		runs(function() {
			expect(toaster.hideAllVisibleToasts).toHaveBeenCalled();
		});
	});

	it("should play timer not execute callback before the timer finish", function() {
		spyOn(toaster, 'hideAllVisibleToasts');

		runs(function() {
			toaster.play(delay);
		});

		waits(delay - 10);

		runs(function() {
			expect(toaster.hideAllVisibleToasts).not.toHaveBeenCalled();
		});
	});

	it("should stop timer", function() {
		spyOn(toaster, 'hideAllVisibleToasts');

		runs(function() {
			toaster.play(delay).stop();
		});

		waits(delay);

		runs(function() {
			expect(toaster.hideAllVisibleToasts).not.toHaveBeenCalled();
		});
	});


	it("should continue with the remaining time", function() {
		spyOn(toaster, 'hideAllVisibleToasts');

		runs(function() {
			toaster.play(50);
		});

		waits(delay/2);
		runs(function() {
			toaster.stop();
		});
		waits(delay/2);
		runs(function() {
			expect(toaster.hideAllVisibleToasts).not.toHaveBeenCalled();
		});

		runs(function() {
			toaster.play();
		});
		waits(delay/2 + 1);
		runs(function() {
			expect(toaster.hideAllVisibleToasts).toHaveBeenCalled();
		});
	});

	it("should able to push multiple toast into queue", function() {
		var toast = window.toaster.toast();

		toaster.push(toast);
		toaster.push(toast);
		toaster.push(toast);

		expect(toaster.shownQueueLength()).toEqual(3);
	});

	it("should be able to put toast in waiting queue of the max is reached", function() {
		var toaster = window.toaster({
			maxToastShow: 1
		});

		var toast = window.toaster.toast();

		toaster.push(toast);
		toaster.push(toast);
		toaster.push(toast);

		expect(toaster.shownQueueLength()).toEqual(1);
		expect(toaster.waitingQueueLength()).toEqual(2);
	});

	it("should be able to forcibly push toast into shown queue even if the max is reached", function() {
		var toaster = window.toaster({
			maxToastShow: 1
		});

		var toast = window.toaster.toast();

		toaster.push(toast);
		toaster.push(toast, true);
		toaster.push(toast, true);

		expect(toaster.shownQueueLength()).toEqual(3);
	});

	it("should push toast into waiting queue when there are items in the waiting queue", function() {
		var toast = window.toaster.toast();

		toaster.push(toast);

		spyOn(toaster, 'waitingQueueLength').andReturn(1);

		toaster.push(toast);
		toaster.push(toast);

		expect(toaster.shownQueueLength()).toEqual(1);
	});

	it("should show the next batch of toasts in waiting", function() {
		var toaster = window.toaster({
			maxToastShow: 0,
			delay: 50
		});

		var toast = window.toaster.toast();

		toaster.push(toast);
		toaster.push(toast);
		toaster.push(toast);

		expect(toaster.shownQueueLength()).toEqual(0);
		expect(toaster.waitingQueueLength()).toEqual(3);

		toaster.options.maxToastShow = 2;

		runs(function() {
			toaster.showToastsInWaiting();
		});

		waits(50);

		runs(function() {
			expect(toaster.shownQueueLength()).toEqual(2);
			expect(toaster.waitingQueueLength()).toEqual(1);
		});
	});

	it("should hide all toasts in the shown queue", function() {
		var toast1 = window.toaster.toast();
		var toast2 = window.toaster.toast();

		spyOn(toast1, 'hide');
		spyOn(toast2, 'hide');

		toaster.push(toast1);
		toaster.push(toast2);

		toaster.hideAllVisibleToasts();

		expect(toast1.hide).toHaveBeenCalled();
		expect(toast2.hide).toHaveBeenCalled();
	});

	it("should remove toast properly", function() {
		var t = window.toaster.toast();
		toaster.push(t);
		expect(toaster.shownQueueLength()).toEqual(1);
		toaster.removeToast(t);
		expect(toaster.shownQueueLength()).toEqual(0);
	});
});
