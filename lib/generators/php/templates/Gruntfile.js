/*jshint node:true */
var path = require('path');
module.exports = function( grunt ) {
  'use strict';

  // readOptionalJSON by Ben Alman
  // https://gist.github.com/2876125
  function readOptionalJSON( filepath ) {
    var data = {};
    try {
      data = grunt.file.readJSON( filepath );
      grunt.verbose.write( "Reading " + filepath + "..." ).ok();
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
          css_dir: 'app/styles',
          sass_dir: 'app/styles',
          images_dir: 'app/images',
          javascripts_dir: 'app/scripts',
          force: true
        }
      }
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
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
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/images/**/*'
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
        files: { src: 'test/**/*.js' },
        options: readOptionalJSON('test/.jshintrc')
      },
      node: {
        files: { src: ['*.js'] },
        options: readOptionalJSON('.jshintrc')
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
      styles: { dir: 'dist/styles' }
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'assets/**/*.js',
      css: 'styles/**/*.css',
      img: 'images/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'app/templates/layout.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['templates/**/*.html'],
      css: ['styles/**/*.css']
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
      name: 'main',
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
      css: { src: ['assets/**/*.css'], dest: 'assets/styles.css' }
    },

    // Documentation
    // -------------
    docs: {
      js: {
        src: 'docs/docco/*.html'
      },
      options: {
        out: 'docs/index.html',
        template: 'docs/layout/template.html'
      }
    },

    docco: {
      scripts: {
        src: [
          'app/scripts/*.js',
          'temp/scripts/routes/**/*.js',
          'app/scripts/models/**/*.js',
          'app/scripts/views/**/*.js',
          'app/scripts/collections/**/*.js',
          'Gruntfile.js'
        ],
        options: {
          output: 'docs/docco'
        }
      }
    }
  });

  // @TODO move to a separate task
  grunt.loadNpmTasks('grunt-docco');
  grunt.registerMultiTask('docs', 'Generate documentation page', function(target) {
    var cb = this.async();
    if (this.target === 'options') cb();
    this.requiresConfig(['docs', 'options', 'out']);
    this.requiresConfig(['docs', 'options', 'template']);

    var src = grunt.file.expandFiles(this.file.src)
      , files = {}, name;

    console.dir(src);
    src.forEach(function(path) {
      path = path.replace(/^(\w+)\//, ''); // @TODO
      name = (path.match(/\/?(\w+)(?:\.\w+)$/) || [0, path])[1];
      files[name] = path;
    });

    var data = {
          heading: this.target + ' documentation'
        , files: files
      }
      , output = grunt.config(['docs', 'options', 'out'])
      , template = grunt.config(['docs', 'options', 'template']);

    if (this.data.out) output = this.data.out;
    if (this.data.template) template = this.data.template;

    var content = grunt.template.process(grunt.file.read(template), data);
    grunt.file.write(output, content);
    grunt.log.writeln('Writing ' + data.heading + ' to ' + output);
  });

  grunt.loadNpmTasks('grunt-rm');
  grunt.registerTask('test', 'mocha');
  grunt.registerTask('build', 'intro clean compass mkdirs usemin-handler rjs concat css min rev usemin img copy rm time');
};
