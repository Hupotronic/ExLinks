/*jshint node:true, strict:false */
/*global module:false */
var templatizer = require('templatizer'),
	path = require('path');

module.exports = function(grunt) {
grunt.initConfig({
	pkg: "<json:package.json>",
	meta: {
		banner: "<%= grunt.template.process(grunt.file.read('src/banner.js'),pkg) %>"
	},
	recess: {
		main: {
			src: 'style/core.styl',
			dest: 'tmp/core.css',
			options: {
				compile: true,
				compress: true
			}
		}
	},
	replace: {
		main: {
			src: 'src/exlinks.js',
			dest: 'tmp',
			variables: {
				images: "<%= grunt.file.read('images/images.json') %>",
				css: "<%= grunt.file.read('tmp/core.css') %>",
				version: "<%= pkg.version %>"
			},
			prefix: "////"
		},
		templates: {
			src: 'tmp/templatizer.js',
			dest: 'lib',
			variables: {
				templatizer: "extmpl"
			},
			prefix: "root."
		}
	},
	concat: {
		themes: {
			src: ['themes/*.json'],
			dest: 'tmp/themes.json',
			separator: ','
		},
		dist: {
			src: ['<banner:meta.banner>', 'lib/*.js', '<file_strip_banner:tmp/exlinks.js>'],
			dest: 'build/ExLinks.user.js'
		}
	},
	min: {
		dist: {
			src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
			dest: 'build/ExLinks.min.user.js'
		}
	},
	watch: {
		files: ['grunt.js', 'src/*.js', 'style/*.styl', 'tmpl/*.jade', 'data/*.json'],
		tasks: 'default'
	},
	clean: {
		folder: "tmp"
	},
	exec: {
		add: {
			command: 'git add .',
			stdout: true
		},
		commit: {
			command: function(grunt) {
				var version = grunt.config(['pkg','version']);
				return 'git commit -am "Release '+version+'."';
			},
			stdout: true
		},
		version: {
			command: function(grunt) {
				var version = grunt.config(['pkg','version']);
				return 'git tag -a '+version+' -m "'+version+'"';
			},
			stdout: true
		},
		stable: {
			command: function(grunt) {
				var version = grunt.config(['pkg','version']);
				return 'git tag -af stable -m "'+version+'"';
			},
			stdout: true
		},
		push: {
			command: 'git push',
			stdout: true
		},
		pushtags: {
			command: 'git push --tags',
			stdout: true
		}
	},
	globals: {},
	uglify: {}
});
	
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-clean');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-recess');

	grunt.registerTask('default', 'recess templates concat:themes replace concat:dist min clean');
	grunt.registerTask('patch', 'bump:patch default');
	grunt.registerTask('minor', 'bump:minor default');
	grunt.registerTask('major', 'bump:major default');
	grunt.registerTask('release', 'exec:add exec:commit exec:version exec:stable');
	grunt.registerTask('push', 'exec:push exec:pushtags');
	grunt.registerTask('templates', function() {
		templatizer(path.normalize(__dirname + '/tmpl'), path.normalize(__dirname + '/tmp/templatizer.js'));
	});

};
