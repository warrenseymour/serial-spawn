var sut = require('../src/parser');

var mocks = {
	emitter: jasmine.createSpyObj('emitter', ['emit'])
};

describe('parser', function() {
	afterEach(function() {
		mocks.emitter.emit.reset();
	});

	it('splits a buffer using a default delimiter of \\r\\n', function() {
		var buffer = new Buffer('hello\r\nworld\r\n');
		var parser = sut();

		parser(mocks.emitter, buffer);

		expect(mocks.emitter.emit.calls.length).toEqual(2);

		expect(mocks.emitter.emit.calls[0].args).toEqual(['data', jasmine.any(Buffer)]);
		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('hello');

		expect(mocks.emitter.emit.calls[1].args).toEqual(['data', jasmine.any(Buffer)]);
		expect(mocks.emitter.emit.calls[1].args[1].toString()).toEqual('world');
	});

	it('splits a buffer using a given delimiter', function() {
		var buffer = new Buffer('hello\nworld\n');
		var parser = sut('\n');

		parser(mocks.emitter, buffer);

		expect(mocks.emitter.emit.calls.length).toEqual(2);

		expect(mocks.emitter.emit.calls[0].args[1].toString()).toEqual('hello');
		expect(mocks.emitter.emit.calls[1].args[1].toString()).toEqual('world');
	});
});
