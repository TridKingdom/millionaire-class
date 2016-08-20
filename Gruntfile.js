/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var base = grunt.option('base') || '.';

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2016 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				sourcemap: true
			},
			reveal: {
				files: {
					'js/reveal.min.js': [ 'js/reveal.js' ]
				}
			},
			app: {
				files: {
					'js/app.min.js': [ 'js/app.js' ]
				}
			},
			vendor: {
				files: {
					'js/vendor.min.js': [ 'js/vendor.js' ]
				}
			}
		},

		concat: {
	    options: {
	      separator: ';',
	    },
	    app: {
	      src: ['js/app/index.js', 'js/app/**/*.js'],
	      dest: 'js/app.js'
	    },
	    vendor: {
	    	src: [
	    		'lib/js/head.min.js',
	    		'node_modules/jquery/dist/jquery.min.js',
	    		'node_modules/lodash/lodash.min.js',
	    		'node_modules/papaparse/papaparse.min.js',
	    		'node_modules/handlebars/dist/handlebars.min.js'
	    	],
	    	dest: 'js/vendor.js'
	    }
		},

		sass: {
			core: {
				files: {
					'css/reveal.css': 'css/reveal.scss',
				}
			},
			app: {
				files: {
					'css/app.css': 'css/app.scss',
				}
			},
			themes: {
				files: [
					{
						expand: true,
						cwd: 'css/theme/source',
						src: ['*.scss'],
						dest: 'css/theme',
						ext: '.css'
					}
				]
			}
		},

		autoprefixer: {
			dist: {
				src: ['css/reveal.css', 'css/app.css']
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/reveal.min.css': [ 'css/reveal.css' ],
					'css/app.min.css': [ 'css/app.css' ]
				}
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js', 'js/app/**/*.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: base,
					livereload: true,
					open: true
				}
			}
		},

		zip: {
			'reveal-js-presentation.zip': [
				'index.html',
				'css/**',
				'js/**',
				'lib/**',
				'images/**',
				'plugin/**',
				'**.md'
			]
		},

		watch: {
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			appJs: {
				files: [ 'js/app/**/*.js' ],
				tasks: 'js-app'
			},
			appCss: {
				files: [ 'css/app.scss', 'css/app/**/*.scss' ],
				tasks: 'css-app'
			},
			theme: {
				files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: [ '*.html' ]
			},
			markdown: {
				files: [ '*.md' ]
			},
			options: {
				livereload: true
			}
		}

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-zip' );


	// Default task
	grunt.registerTask( 'default', [ 'css', 'js', 'js-app', 'js-vendor' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify:reveal', 'qunit' ] );

	// JS App task
	grunt.registerTask( 'js-app', [ 'jshint', 'concat:app', 'uglify:app' ] );

	// JS vendor task
	grunt.registerTask( 'js-vendor', [ 'concat:vendor' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// CSS App task
	grunt.registerTask( 'css-app', [ 'sass:app', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};
