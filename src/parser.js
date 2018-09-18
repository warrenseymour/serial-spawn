var bufferSplit = require('buffer-split');

/**
 * Like the `serialport` readline parser, but it doesn't convert Buffers to a
 * string first.
 */
function readline(delimiter) {
	var data = new Buffer('');
	var newlineDelimiter = new Buffer(delimiter || '\r\n');

	return function(emitter, buffer) {
		data = Buffer.concat([
			data,
			buffer
		]);

		var parts = bufferSplit(data, newlineDelimiter);
		data = parts.pop();

		parts.forEach(function(part) {
			emitter.emit('data', part);
		});
	};
}

/**
 * A 'latching' parser that buffers bytes received and then flushes them `delay`
 * milliseconds after the last data was received.
 */
var DEFAULT_DELAY = 100;
function latch(delay) {
	var data = new Buffer('');
	var timeout;

	return function (emitter, buffer) {
		data = Buffer.concat([
			data,
			buffer
		]);

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(function() {
			emitter.emit('data', data);
			data = new Buffer('');
		}, delay || DEFAULT_DELAY);
	};
}

module.exports = {
	readline: readline,
	latch: latch
};
