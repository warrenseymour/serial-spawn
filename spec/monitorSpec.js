var mockery = require('mockery');
mockery.enable();
mockery.registerAllowable('../src/monitor');

var mocks = {
	serialport: jasmine.createSpyObj('serialport', ['SerialPort']),
	listener: jasmine.createSpy('SerialPort listener'),
	child_process: jasmine.createSpyObj('child_process', ['exec'])
};

mocks.serialport.SerialPort.andReturn({
	on: mocks.listener
});
mocks.serialport.parsers = {
	readline: function() { return function() {}; }
};

mockery.registerMock('serialport', mocks.serialport);
mockery.registerMock('child_process', mocks.child_process);

describe('monitor', function() {
	var Monitor, config;

	beforeEach(function() {
		config = {
			ports: [
				{ name: 'test1', port: 'COM1' },
				{ name: 'test2', port: 'COM2' }
			]
		};

		Monitor = require('../src/monitor');
	});

	afterEach(function() {
		mocks.serialport.SerialPort.reset();
		mocks.listener.reset();
		mocks.child_process.exec.reset();
	});

	it('should configure and listen on ports defined in config', function() {
		var sut = new Monitor(config);

		expect(mocks.serialport.SerialPort.callCount).toEqual(2);

		expect(mocks.serialport.SerialPort.calls[0].args).toEqual([
			'COM1',
			{ baudrate: 1200, parser: jasmine.any(Function) }
		]);
		expect(mocks.serialport.SerialPort.calls[1].args).toEqual([
			'COM2',
			{ baudrate: 1200, parser: jasmine.any(Function) }
		]);

		expect(mocks.listener.callCount).toEqual(2);
		expect(mocks.listener.calls[0].args).toEqual(['data', jasmine.any(Function)]);
	});

	it('should call .data() with port and data args', function() {
		var sut = new Monitor(config);

		spyOn(sut, 'data');

		var fn = mocks.listener.calls[0].args[1];
		fn('test-data');

		expect(sut.data).toHaveBeenCalledWith(config.ports[0], 'test-data');
	});

	it('should call config.spawn() with port and data args', function() {
		config.spawn = jasmine.createSpy('spawn');
		var sut = new Monitor(config);
		sut.data(config.ports[0], 'test-data');

		expect(config.spawn).toHaveBeenCalledWith(config.ports[0], 'test-data');
	});

	it('should execute shell command returned by config.spawn()', function() {
		config.spawn = function() { return 'foo'; };
		var sut = new Monitor(config);

		sut.data(config.ports[0], 'test-data');

		expect(mocks.child_process.exec).toHaveBeenCalledWith('foo');
	});

	it('should not execute shell command if config.spawn() is falsy', function() {
		[undefined, null, false].forEach(function(type) {
			config.spawn = function() { return type; };
			var sut = new Monitor(config);

			sut.data(config.ports[0], 'test-data');
		});

		expect(mocks.child_process.exec.callCount).toEqual(0);
	});
});
