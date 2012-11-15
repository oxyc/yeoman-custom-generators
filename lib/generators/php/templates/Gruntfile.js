/*jshint node:true es5:true */
module.exports = function( grunt ) {
  'use strict';

  var gateway = require('gateway');

  var app_scripts = [
      'app/scripts/*.js'
    , 'app/scripts/routes/**/*.js'
    , 'app/scripts/models/**/*.js'
    , 'app/scripts/views/**/*.js'
    , 'app/scripts/collections/**/*.js'
  ];

  // readOptionalJSON by Ben Alman
  // https://gist.github.com/2876125

  function readOptionalJSON(filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
      grunt.verbose.write('Reading ' + filepath + '...').ok();
    } catch(e) {}
    return data;
  }

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          // These are somewhat overriden to support developing in app/
          css_dir: 'app/assets',
          sass_dir: 'app/styles',
          images_dir: 'app/img',
          javascripts_dir: 'app/assets',
          force: true
        }
      }
    },

    // headless testing through PhantomJS
    mocha: {
      all: {
        src: ['test/**/*.html'],
        options: {
          timeout: 3000
        }
      }
    },

    // default watch configuration
    watch: {
      compass: {
        files: ['app/styles/**/*.{scss,sass}'],
        tasks: 'compass reload'
      },
      reload: {
        files: [
          'app/templates/**/.html',
          'app/**/.php',
          'app/assets/**/*.css',
          'app/scripts/**/*.js',
          'app/img/**/*'
        ],
        tasks: 'reload'
      }
    },


    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      options: {
        options: readOptionalJSON('.jshintrc'),
        globals: { jQuery: true }
      },
      tests: {
        files: { src: ['test/*.js', 'test/spec/**/*.js'] },
        options: {
          options: readOptionalJSON('test/.jshintrc'),
          globals: { describe: true, before: true, after: true, it: true, beforeEach: true, afterEach: true, expect: true, Backbone: true, jQuery: true, $: true, _: true }
        }
      },
      client: {
        files: { src: app_scripts },
        options: {
          options: readOptionalJSON('app/scripts/.jshintrc'),
          globals: { jQuery: true, Backbone: true, $: true, _: true, console: true }
        }
      },
      node: {
        files: { src: ['*.js'] },
        options: {
          options: readOptionalJSON('app/scripts/.jshintrc'),
          jshintrc: '.jshintrc'
        }
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Clean up files which aren't used in the final output
    rm: {
      scripts: { dir: 'dist/scripts' },
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'assets/styles.css': ['assets/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'assets/**/*.js',
      css: 'assets/**/*.css',
      img: 'img/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'app/templates/layout.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['templates/**/*.html'],
      css: ['assets/**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      mainFile: 'templates/layout.html',
      // Because of the relative path of the config in layout.html we have to
      // define it here.
      name: 'config',
      out: 'assets/script.js',
      wrap: true
    },

    concat: {
      dist: {
        src: ['scripts/libs/almond.js', 'assets/script.js'],
        dest: 'assets/script.js'
      }
    },
    min: {
      js: { src: ['assets/**/*.js'], dest: 'assets/script.js' },
    },

    // Documentation
    // -------------
    docspage: {
      sections: {
        js: 'docs/js/*.html',
        php: 'docs/*.html'
      },
      options: {
        out: 'docs/index.html',
        template: 'docs/layout/template.jst'
      }
    },

    doccoh: {
      scripts: {
        src: app_scripts.concat([
          'Gruntfile.js'
        ]),
        options: {
          output: 'docs/js'
        }
      }
    },

    // Server
    // ------
    connect: {
      port: 9001,
      hostname: 'localhost', // You might have to fill this in
      base: 'app',
      middleware: function(connect, options) {
        return [
          // Serve PHP files via php-cgi.
          gateway(options.base),
          // Serve static files.
          connect.static(options.base),
          // Make empty directories browsable.
          connect.directory(options.base)
        ];
      }
    }
  });

  grunt.renameTask('server', 'yeoman-server');
  // Modify the server task by allowing to serve php and specifying which
  // directory (target) to serve. Eg. `yeoman server:dist`
  grunt.registerTask('server', 'Start a server', function(target) {
    var options = grunt.config('connect');
    if (target) options.base = target;
    grunt.config('connect', options);
    grunt.task.run('connect:keepalive');
  });

  grunt.loadNpmTasks('grunt-doccoh');
  grunt.loadNpmTasks('grunt-docs-landing');
  grunt.loadNpmTasks('grunt-rm');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('test', 'mocha');
  grunt.registerTask('docs', 'doccoh docspage');
  grunt.registerTask('build', 'intro clean compass mkdirs usemin-handler rjs concat css min rev usemin img copy rm time');
};
