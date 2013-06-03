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

		toast.init();

		expect(toast.show).toHaveBeenCalled();

		closeBtn(toast).click();
		expect(toast.hide).toHaveBeenCalled();
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
