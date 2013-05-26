describe("The toaster", function() {
	var toaster;

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
		expect($('.' + toaster.options.cls).length).toEqual(1);
	});

	it("should destroy the toaster", function() {
		toaster.destroy();
		expect($('.' + toaster.options.cls).length).toEqual(0);
	});

	it("should insert toast into the toaster", function() {
		var toast = window.toaster.toast();

		expect(toaster.shownQueueLength()).toEqual(0);
		toaster.push(toast);
		expect(toaster.shownQueueLength()).toEqual(1);

		spyOn(toaster, 'stopToasts');
		toast.trigger('mouseover');
		expect(toaster.stopToasts).toHaveBeenCalled();

		spyOn(toaster, 'playToasts');
		toast.trigger('mouseout');
		expect(toaster.playToasts).toHaveBeenCalled();

		expect(toaster.hasToast(toast)).toEqual(true);

		spyOn(toaster, 'showNextToastInWaiting');
		spyOn(toaster, 'removeToast');
		toast.trigger('hide');
		expect(toaster.showNextToastInWaiting).toHaveBeenCalled();
		expect(toaster.removeToast).toHaveBeenCalledWith(toast);
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

	it("should show the next toast in waiting", function() {
		var toaster = window.toaster({
			maxToastShow: 0
		});

		var toast = window.toaster.toast();

		toaster.push(toast);

		expect(toaster.shownQueueLength()).toEqual(0);
		expect(toaster.waitingQueueLength()).toEqual(1);
		toaster.showNextToastInWaiting();
		expect(toaster.shownQueueLength()).toEqual(1);
		expect(toaster.waitingQueueLength()).toEqual(0);
	});

	it("should stop all toasts in the shown queue", function() {
		var toast1 = window.toaster.toast();
		var toast2 = window.toaster.toast();

		spyOn(toast1, 'stop');
		spyOn(toast2, 'stop');

		toaster.push(toast1);
		toaster.push(toast2);

		toaster.stopToasts();

		expect(toast1.stop).toHaveBeenCalled();
		expect(toast2.stop).toHaveBeenCalled();
	});

	it("should play all toasts in the shown queue", function() {
		var toast1 = window.toaster.toast();
		var toast2 = window.toaster.toast();

		spyOn(toast1, 'play');
		spyOn(toast2, 'play');

		toaster.push(toast1);
		toaster.push(toast2);

		toaster.playToasts();

		expect(toast1.play).toHaveBeenCalled();
		expect(toast2.play).toHaveBeenCalled();
	});

	it("should remove toast properly", function() {
		var t = window.toaster.toast();
		toaster.push(t);
		expect(toaster.shownQueueLength()).toEqual(1);
		toaster.removeToast(t);
		expect(toaster.shownQueueLength()).toEqual(0);
	});
});
