module.exports = function (grunt) {
	require("time-grunt")(grunt);
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		//clean: {
		//	dist: ['dist']
		//},

		sprite: {
			dist: {
				src: 'app/images/sprite/**/*.png',
				destImg: 'app/images/sprite.png',
				imgPath: '../images/sprite.png',
				destCSS: 'app/styles/__helpers/sprite.styl',
				cssFormat: 'stylus',
				algorithm: 'binary-tree',
				padding: 13,
				engine: 'pngsmith',
				imgOpts: {
					format: 'png'
				}
			}
		},

		imagemin: {
			images: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
					dest: 'dist/images'
				}]
			}
		},

		stylus: {
			options: {
				compress: false
			},
			compile: {
				files: [{
					cwd: 'app/styles',
					src: 'common.styl',
					dest: 'dist/styles',
					expand: true,
					ext: '.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Android >= <%= pkg.browsers.android %>',
					'Chrome >= <%= pkg.browsers.chrome %>',
					'Firefox >= <%= pkg.browsers.firefox %>',
					'Explorer >= <%= pkg.browsers.ie %>',
					'iOS >= <%= pkg.browsers.ios %>',
					'Opera >= <%= pkg.browsers.opera %>',
					'Safari >= <%= pkg.browsers.safari %>'
				]
			},
			dist: {
				src: ['dist/styles/**/*.css']
			}
		},

		cmq: {
			dist: {
				files: {
					'dist/styles/common.css': [
						'dist/styles/common.css'
					]
				}
			}
		},

		csscomb: {
			dist: {
				options: {
					config: '.csscomb.json'
				},
				files: [{
					expand: true,
					cwd: 'dist/styles',
					src: '**/*.css',
					dest: 'dist/styles'
				}]
			}
		},

		jade: {
			dist: {
				options: {
					data: {
						page: {
							copyright: '<%= pkg.copyright %>',
							description: '<%= pkg.description %>',
							keywords: '<%= pkg.keywords.join(\', \') %>',
							title: '<%= pkg.title %>'
						}
					}
				},
				files: [{
					cwd: 'app/templates/pages',
					src: ['**/*.jade'],
					dest: 'dist',
					expand: true,
					ext: '.html'
				}]
			}
		},

		prettify: {
			options: {
				brace_style: 'expand',
				indent: 1,
				indent_char: '	',
				condense: true,
				indent_inner_html: true
			},
			all: {
				expand: true,
				cwd: 'dist',
				ext: '.html',
				src: '**/*.html',
				dest: 'dist'
			},
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				force: true,
				globals: {
					jQuery: true
				}
			},
			all: [
				'app/scripts/**/*.js',
				'!app/scripts/libs/**/*',
				'!app/scripts/tinymce/**/*'
			],
			configFiles: [
				'.csscomb.json',
				'Gruntfile.js',
				'package.json'
			]
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					cwd: 'app/fonts',
					src: '**/*',
					dest: 'dist/fonts',
					filter: 'isFile'
				}]
			},
			scripts: {
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: ['**/*.js'],
					dest: 'dist/scripts',
					filter: 'isFile'
				}]
			},
			resources: {
				files: [{
					expand: true,
					cwd: 'app/resources',
					src: '**/*',
					dest: 'dist',
					filter: 'isFile'
				}]
			}
		},

		browserSync: {
			dist: {
				bsFiles: {
					src: 'dist/**/*'
				},
				options: {
					open: false,
					server: {
						baseDir: 'dist'
					},
					watchTask: true
				}
			}
		},

		watch: {
			options: {
				dateFormat: function (ms) {
					var now = new Date(),
						time = now.toLocaleTimeString(),
						day = now.getDate(),
						month = now.getMonth() + 1,
						year = now.getFullYear();

					if (day < 10) {
						day = '0' + day;
					}

					if (month < 10) {
						month = '0' + month;
					}

					grunt.log.subhead(
						'Completed in ' + Math.round(ms) + 'ms at ' + time + ' ' +
						day + '.' + month + '.' + year + '.\n' +
						'Waiting for more changes...'
					);
				},
			},
			configFiles: {
				options: {
					reload: true
				},
				files: ['.csscomb.json', 'Gruntfile.js', 'package.json'],
				tasks: ['newer:jshint:configFiles']
			},
			livereload: {
				options: {
					livereload: false
				},
				files: ['dist/**/*']
			},
			sprite: {
				files: ['app/images/sprite/**/*.png'],
				tasks: ['sprite']
			},
			imagemin: {
				files: ['app/images/**/*.{png,jpg,gif}', '!app/images/sprite/**/*'],
				tasks: ['newer:imagemin']
			},
			stylus: {
				files: ['app/styles/**/*.styl'],
				tasks: ['stylus', 'autoprefixer', 'cmq', 'csscomb']
			},
			jade: {
				files: ['app/templates/pages/**/*.jade'],
				tasks: ['newer:jade', 'newer:prettify']
			},
			jadePartials: {
				files: ['app/templates/**/*.jade', '!app/templates/pages/**/*.jade'],
				tasks: ['jade', 'newer:prettify']
			},
			jshint: {
				files: ['app/scripts/**/*.js', '!app/scripts/tinymce/**/*.js'],
				tasks: ['newer:jshint:all']
			},
			scripts: {
				files: ['app/scripts/**/*.js', '!app/scripts/tinymce/**/*.js'],
				tasks: ['newer:copy:scripts']
			},
			copyResources: {
				files: ['app/resources/**/*'],
				tasks: ['newer:copy:resources']
			},
			copyFonts: {
				files: ['app/fonts/**/*'],
				tasks: ['newer:copy:fonts']
			}
		},

		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				commitMessage: false,
				commitFiles: false,
				createTag: false,
				tagName: false,
				tagMessage: false,
				push: false,
				pushTo: false,
				gitDescribeOptions: false
			}
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', [
		//'clean',
		'sprite',
		//'imagemin',
		'stylus',
		'autoprefixer',
		'cmq',
		'csscomb',
		'jade',
		'prettify',
		'jshint',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'browserSync',
		'watch'
	]);

};
