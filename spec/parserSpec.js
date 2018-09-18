var sut = require('../src/parser');

var mocks = {
	emitter: jasmine.createSpyObj('emitter', ['emit'])
};

afterEach(function() {
	mocks.emitter.emit.reset();
});

describe('readline', function() {
	it('splits a buffer using a default delimiter of \\r\\n', function() {
		var buffer = new Buffer('hello\r\nworld\r\n');
		var parser = sut.readline();

		parser(mocks.emitter, buffer);

		expect(mocks.emitter.emit.calls.length).toEqual(2);

		expect(mocks.emitter.emit.calls[0].args).toEqual(['data', jasmine.any(Buffer)]);
		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('hello');

		expect(mocks.emitter.emit.calls[1].args).toEqual(['data', jasmine.any(Buffer)]);
		expect(mocks.emitter.emit.calls[1].args[1].toString()).toEqual('world');
	});

	it('splits a buffer using a given delimiter', function() {
		var buffer = new Buffer('hello\nworld\n');
		var parser = sut.readline('\n');

		parser(mocks.emitter, buffer);

		expect(mocks.emitter.emit.calls.length).toEqual(2);

		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('hello');
		expect(mocks.emitter.emit.calls[1].args[1].toString()).toEqual('world');
	});
});

describe('latch', function() {
	beforeEach(function() {
		jasmine.Clock.useMock();
	});

	it('buffers data and flushes 100 milliseconds after last byte is received', function() {
		var parser = sut.latch();
		parser(mocks.emitter, new Buffer('Hello\n'));
		jasmine.Clock.tick(50);
		parser(mocks.emitter, new Buffer('World'));
		jasmine.Clock.tick(50);

		expect(mocks.emitter.emit.calls.length).toEqual(0);
		jasmine.Clock.tick(100);

		parser(mocks.emitter, new Buffer('Testing '));
		parser(mocks.emitter, new Buffer('again'));

		expect(mocks.emitter.emit.calls.length).toEqual(1);
		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('Hello\nWorld');

		jasmine.Clock.tick(50);
		expect(mocks.emitter.emit.calls.length).toEqual(1);

		jasmine.Clock.tick(50);
		expect(mocks.emitter.emit.calls.length).toEqual(2);
		expect(mocks.emitter.emit.calls[1].args[1].toString()).toEqual('Testing again');
	});

	it('latches using a configurable delay', function() {
		var parser = sut.latch(500);
		parser(mocks.emitter, new Buffer('Hello\n'));
		jasmine.Clock.tick(50);
		parser(mocks.emitter, new Buffer('World'));
		jasmine.Clock.tick(50);

		expect(mocks.emitter.emit.calls.length).toEqual(0);
		jasmine.Clock.tick(100);
		expect(mocks.emitter.emit.calls.length).toEqual(0);

		jasmine.Clock.tick(500);

		expect(mocks.emitter.emit.calls.length).toEqual(1);
		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('Hello\nWorld');
	});
});
