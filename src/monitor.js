var serialport = require('serialport'),
		exec = require('child_process').exec,
		parser = require('./parser');

module.exports = function(config) {
	var self = this;

	var ports = config.ports.map(function(port) {
		var instance = new serialport.SerialPort(port.port, {
			baudrate: 1200,
			parser: config.parser || parser.readline()
		});

		instance.on('data', function(data) {
			self.data(port, data);
		});

		return instance;
	});

	self.data = function(port, data) {
		var command = config.spawn(port, data);
		if (!command) {
			return;
		}

		exec(command);
	};
};
