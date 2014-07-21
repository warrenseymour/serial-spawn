module.exports = function(grunt) {
	grunt.initConfig({
		jasmine_node: {
			options: {
				growl: true
			},
			all: ['spec'],
		},

		watch: {
			files: ['./*.js', './src/*.js', './spec/*.js'],
			tasks: 'jasmine_node'
		}
	});

	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jasmine_node']);
	grunt.registerTask('dev', ['watch']);
};
