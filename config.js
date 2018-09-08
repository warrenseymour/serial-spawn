var config = {

	/**
	 * Configure devices here. By default, a single device is connected to
	 * port 'COM1' and named 'line1'.
	 *
	 * Rename or add more lines by modifying the 'ports' property.
	 */
	ports: [
		{
			name: 'line1',
			port: 'COM1'
		},
	],

	/**
	 * The 'spawn' function is called whenever data is received by a serial port.
	 *
	 * The function takes two arguments - 'port' and 'data':
	 * - 'port' will be the configuration of the port specified by the 'ports'
	 *   configuration above. Use this to change the command invoked depending
	 *   upon the port that received data.
	 * - 'data' will be the data received by the serial port.
	 *
	 * This function should return the string that will be executed. If the
	 * return value is falsy, no command will be invoked.
	 */
	spawn: function(port, data) {
		return 'echo ' + port.name + ": " + data.toString();
	}
};

module.exports = config;
