describe("The toaster", function() {
	var _toaster;

	beforeEach(function() {
		_toaster = window.toaster();
	});

	afterEach(function() {
		_toaster.destroy();
		_toaster = null;
	});

	it("should setup the toaster", function() {
		expect(_toaster).not.toBeNull();
		expect(_toaster.options).not.toBeNull();
		expect(_toaster.options.$el).not.toBeNull();
		expect($('.' + _toaster.options.cls).length).toEqual(1);
	});

	it("should destroy the toaster", function() {
		_toaster.destroy();
		expect($('.' + _toaster.options.cls).length).toEqual(0);
	});

	it("should insert toast into the toaster", function() {
		loadToastDom();
		var toast = toaster.toast($('.toaster-toast'));

		expect(_toaster.shownQueueLength()).toEqual(0);
		_toaster.push(toast);
		expect(_toaster.shownQueueLength()).toEqual(1);

		spyOn(_toaster, 'stopToasts');
		toast.trigger('mouseover');
		expect(_toaster.stopToasts).toHaveBeenCalled();

		spyOn(_toaster, 'playToasts');
		toast.trigger('mouseout');
		expect(_toaster.playToasts).toHaveBeenCalled();

		expect(_toaster.hasToast(toast)).toEqual(true);

		spyOn(_toaster, 'showNextToastInWaiting');
		toast.trigger('hide');
		expect(_toaster.showNextToastInWaiting).toHaveBeenCalled();
	});

	it("should able to push multiple toast into queue", function() {
		loadToastDom();
		var toast = toaster.toast($('.toaster-toast'));

		_toaster.push(toast);
		_toaster.push(toast);
		_toaster.push(toast);

		expect(_toaster.shownQueueLength()).toEqual(3);
	});

	it("should be able to put toast in waiting queue of the max is reached", function() {
		loadToastDom();
		var _toaster = toaster({
			maxToastShow: 1
		});

		var toast = toaster.toast($('.toaster-toast'));

		_toaster.push(toast);
		_toaster.push(toast);
		_toaster.push(toast);

		expect(_toaster.shownQueueLength()).toEqual(1);
		expect(_toaster.waitingQueueLength()).toEqual(2);
	});

	it("should show the next toast in waiting", function() {
		loadToastDom();

		var _toaster = toaster({
			maxToastShow: 0
		});

		var toast = toaster.toast($('.toaster-toast'));

		_toaster.push(toast);

		expect(_toaster.shownQueueLength()).toEqual(0);
		expect(_toaster.waitingQueueLength()).toEqual(1);
		_toaster.showNextToastInWaiting();
		expect(_toaster.shownQueueLength()).toEqual(1);
		expect(_toaster.waitingQueueLength()).toEqual(0);
	});

	it("should stop all toasts in the shown queue", function() {
		loadToastDom();

		var toast1 = toaster.toast($('.toaster-toast'));
		var toast2 = toaster.toast($('.toaster-toast'));

		spyOn(toast1, 'stop');
		spyOn(toast2, 'stop');

		_toaster.push(toast1);
		_toaster.push(toast2);

		_toaster.stopToasts();

		expect(toast1.stop).toHaveBeenCalled();
		expect(toast2.stop).toHaveBeenCalled();
	});

	it("should play all toasts in the shown queue", function() {
		loadToastDom();

		var toast1 = toaster.toast($('.toaster-toast'));
		var toast2 = toaster.toast($('.toaster-toast'));

		spyOn(toast1, 'play');
		spyOn(toast2, 'play');

		_toaster.push(toast1);
		_toaster.push(toast2);

		_toaster.playToasts();

		expect(toast1.play).toHaveBeenCalled();
		expect(toast2.play).toHaveBeenCalled();
	});
});
