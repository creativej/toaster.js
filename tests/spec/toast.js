describe("A toast", function() {
	var toast, $toast;

	beforeEach(function() {
		loadToastDom();
		$toast =  $(".toaster-toast");
		toast = toaster.toast($toast);
	});

	afterEach(function() {
		removeToastDom();
		toast = null;
	});

	it("should return a toast object", function() {
		expect(toast).not.toBeNull();
		expect(toast.options).not.toBeNull();
		expect(toast.$el).toEqual($toast);
	});

	it("should run bind the correct event and run the correct method on initializing" , function() {
		spyOn(toast, 'hide');
		spyOn(toast, 'show');
		spyOn(toast, 'trigger');
		toast.init();

		expect(toast.show).toHaveBeenCalled();

		$toast.find(toast.options.closeBtn).click();
		expect(toast.hide).toHaveBeenCalled();

		$toast.trigger('mouseover');
		expect(toast.trigger).toHaveBeenCalledWith('mouseover');

		$toast.trigger('mouseout');
		expect(toast.trigger).toHaveBeenCalledWith('mouseout');
	});

	it("should add show class to $el", function() {
		toast.show();
		expect(toast.$el.hasClass('show')).toEqual(true);
	});

	it("should remove show class to $el", function() {
		toast.$el.addClass('show');
		toast.hide();
		expect(toast.$el.hasClass('show')).toEqual(false);
	});

	it("should play timer and execute callback", function() {
		toast = toaster.toast($toast, {
			duration: 50
		});

		toast.init();

		runs(function() {
			toast.play();
		});

		waitsFor(function() {
			return !$toast.hasClass('show');
		}, 'should execute callback', toast.options.duration);
	});

	it("should play timer not execute callback before the timer finish", function() {
		toast.init();

		runs(function() {
			toast.play();
		});

		waitsFor(function() {
			return $toast.hasClass('show');
		}, 'should execute callback', toast.options.duration - 500);
	});

	it("should stop timer", function() {
		toast = toaster.toast($toast, {
			duration: 50
		});

		toast.init();

		runs(function() {
			toast
				.play()
				.stop();
		});

		waitsFor(function() {
			return $toast.hasClass('show');
		}, 'should not execute callback', toast.options.duration);
	});

	it("should destroy and unbind all events", function() {
		toast.init();
		toast.destroy();

		spyOn(toast, 'hide');
		spyOn(toast, 'trigger');

		$toast.find(toast.options.closeBtn).click();
		expect(toast.hide).not.toHaveBeenCalled();

		$toast.trigger('mouseover');
		expect(toast.trigger).not.toHaveBeenCalled();

		$toast.trigger('mouseout');
		expect(toast.trigger).not.toHaveBeenCalled();

		expect($(".toaster-toast").length).toEqual(0);
	});
});
