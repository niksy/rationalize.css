/* jshint node:true */

module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> */\n'
		},

		concat: {
			dist: {
				options: {
					stripBanners: true,
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/<%= pkg.name %>': ['compiled/<%= pkg.main %>']
				}
			}
		},

		cssmin: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				files: {
					'dist/rationalize.min.css': ['compiled/<%= pkg.main %>']
				}
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		autoprefixer: {
			dist: {
				options: {
					browsers: ['last 2 versions', 'Firefox >= 20', 'iOS >= 5', 'Android >= 2', 'Explorer 8']
				},
				src: '<%= pkg.main %>',
				dest: 'compiled/<%= pkg.main %>'
			}
		},

		'compile-handlebars': {
			test: {
				templateData: {
					bower: '../../../bower_components',
					compiled: '../../../compiled',
					assets: 'assets',
					main: '<%= pkg.main %>'
				},
				partials: 'test/manual/templates/partials/**/*.hbs',
				template: 'test/manual/templates/*.hbs',
				output: 'compiled/test/manual/*.html'
			}
		},

		copy: {
			test: {
				files:[{
					expand: true,
					cwd: 'test/manual/assets/',
					src: ['**'],
					dest: 'compiled/test/manual/assets/'
				}]
			},
			css: {
				options: {
					process: function ( content, srcpath ) {
						return content.replace(/\*\/\n/g,'*/');
					}
				},
				files: {
					'dist/rationalize.min.css': ['dist/rationalize.min.css']
				}
			}
		},

		connect: {
			test:{
				options: {
					port: 4242,
					open: true
				}
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			test: ['watch','connect:test:keepalive']
		},

		watch: {
			hbs: {
				files: 'test/manual/**/*.hbs',
				tasks: ['compile-handlebars:test']
			},
			css: {
				files: ['<%= pkg.main %>'],
				tasks: ['autoprefixer:dist']
			}
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', function () {
		var tasks = ['compile-handlebars:test','copy:test','autoprefixer:dist'];
		if ( grunt.option('watch') ) {
			tasks.push('concurrent:test');
		}
		grunt.task.run(tasks);
	});

	grunt.registerTask('default', ['autoprefixer', 'concat', 'cssmin', 'copy:css']);
	grunt.registerTask('release:patch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('release:minor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('release:major', ['bump-only:major', 'default', 'bump-commit']);

};
