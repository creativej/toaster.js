describe('eventable', function() {

	it('should trigger event handler to a list and update value', function() {
		var obj = eventable();
		var test = 0;

		obj.on('update', function(){
			test = 1;
		});

		expect(test).toEqual(0);

		obj.trigger('update');

		expect(test).toEqual(1);
	});

	it('should trigger multiple event handlers to a list and update value', function() {
		var obj = eventable();
		var test = 0;
		var test2 = 0;

		obj.on('update', function(){
			test = 1;
		});
		obj.on('update', function(){
			test2 = 1;
		});

		expect(test).toEqual(0);
		expect(test2).toEqual(0);

		obj.trigger('update');

		expect(test).toEqual(1);
		expect(test2).toEqual(1);
	});

	it('should remove trigger event handler to a list and not update value', function() {
		var obj = eventable();
		var test = 0;

		var callback = function(){
			test = 1;
		};

		obj.on('update', callback);
		obj.off('update', callback);

		obj.trigger('update');

		expect(test).toEqual(0);
	});

	it('should remove trigger multiple event handlers to a list and not update value', function() {
		var obj = eventable();
		var test = 0;
		var test2 = 0;

		obj
			.on('update', function(){
				test = 1;
			})
			.on('update', function(){
				test2 = 1;
			})
			.off('update');

		obj.trigger('update');

		expect(test).toEqual(0);
		expect(test2).toEqual(0);
	});

	it('should remove trigger specific event handlers to a list and not update value', function() {
		var obj = eventable();
		var test = 0;
		var test2 = 0;

		var callback = function(){
			test2 = 1;
		};

		obj
			.on('update', function(){
				test = 1;
			})
			.on('update', callback)
			.off('update', callback);

		obj.trigger('update');

		expect(test).toEqual(1);
		expect(test2).toEqual(0);
	});

	it('should mute the object pass into', function() {
		var obj = eventable({
			test: 1
		});

		expect(obj.test).toEqual(1);
	});


	it('should reference itself on callback', function() {
		var obj = eventable({
			test: 1
		});

		obj.on('update', function() {
			this.test = 0;
		});

		obj.trigger('update');

		expect(obj.test).toEqual(0);
	});
});
