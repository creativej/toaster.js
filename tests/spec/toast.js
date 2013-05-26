describe("A toast", function() {
	var toast;

	function closeBtn(toast) {
		return toast.$el.find('.' + toast.options.closeBtnClass);
	}

	function contentBtn(toast) {
		return toast.$efind('.' + toast.options.contentClass);
	}

	beforeEach(function() {
		toast = toaster.toast();
	});

	afterEach(function() {
		toast = null;
	});

	it("should return a toast object", function() {
		expect(toast).not.toBeNull();
		expect(toast.options).not.toBeNull();
		expect(closeBtn(toast).length).toEqual(1);
	});

	it("should bind the correct events and run the correct method on initializing" , function() {
		spyOn(toast, 'hide');
		spyOn(toast, 'show');
		spyOn(toast, 'trigger');

		toast.init();

		expect(toast.show).toHaveBeenCalled();

		closeBtn(toast).click();
		expect(toast.hide).toHaveBeenCalled();

		toast.$el.trigger('mouseover');
		expect(toast.trigger).toHaveBeenCalledWith('mouseover');

		toast.$el.trigger('mouseout');
		expect(toast.trigger).toHaveBeenCalledWith('mouseout');
	});

	it("should add show class to $el", function() {
		toast = toaster.toast({
			transitionDuraion: 50,
			fallIntoPositionDuration: 10
		});

		spyOn(toast, 'trigger');
		toast.show();
		waitsFor(function() {
			return toast.$el.css('opacity') == 1;
		}, 'should trigger show', toast.options.transitionDuraion + toast.options.fallIntoPositionDuration);

	});

	it("should remove show class to $el", function() {
		toast = toaster.toast({
			transitionDuraion: 50,
			fallIntoPositionDuration: 10
		});

		spyOn(toast, 'trigger');
		toast.$el.css('opacity', 1);
		toast.hide();
		waitsFor(function() {
			return toast.$el.css('opacity') == 0;
		}, 'should trigger hide', toast.options.transitionDuraion + toast.options.fallIntoPositionDuration);
	});

	it("should play timer and execute callback", function() {
		toast = toaster.toast({
			duration: 50,
			transitionDuraion: 50,
			fallIntoPositionDuration: 10
		});

		toast.init();

		runs(function() {
			toast.play();
		});

		waitsFor(function() {
			return !closeBtn(toast).hasClass('toast--show');
		}, 'should execute callback', toast.options.duration + toast.options.transitionDuraion + toast.options.fallIntoPositionDuration);
	});

	it("should play timer not execute callback before the timer finish", function() {
		toast = toaster.toast({
			duration: 50,
			transitionDuraion: 50,
			fallIntoPositionDuration: 10
		});

		toast.init();

		runs(function() {
			toast.play();
		});

		waitsFor(function() {
			return toast.$el.css('opacity') == 1;
		}, 'should execute callback', toast.options.duration + toast.options.transitionDuraion + toast.options.fallIntoPositionDuration - 500);
	});

	it("should stop timer", function() {
		toast = toaster.toast({
			duration: 50
		});

		toast.init();

		runs(function() {
			toast
				.play()
				.stop();
		});

		waitsFor(function() {
			return toast.$el.css('opacity') == 1;
		}, 'should not execute callback', toast.options.duration);
	});

	it("should destroy and unbind all events", function() {
		toast.init();
		spyOn(toast.$el, 'remove');
		toast.destroy();

		spyOn(toast, 'hide');
		spyOn(toast, 'trigger');

		closeBtn(toast).click();
		expect(toast.hide).not.toHaveBeenCalled();

		toast.$el.trigger('mouseover');
		expect(toast.trigger).not.toHaveBeenCalled();

		toast.$el.trigger('mouseout');
		expect(toast.trigger).not.toHaveBeenCalled();

		expect(toast.$el.remove).toHaveBeenCalled();
	});
});
