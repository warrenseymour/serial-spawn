/**
 * Like the `serialport` readline parser, but it doesn't convert Buffers to a
 * string first.
 */
function readlineParser() {
    var data = new Buffer('');
    var newlineDelimiter = new Buffer('\r\n');

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

module.exports = readlineParser;
