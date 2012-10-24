module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      options: {
        options: {
          curly: false,
          eqeqeq: true,
          forin: true,
          immed: true,
          indent: 2,
          latedef: true,
          newcap: true,
          noarg: true,
          noempty: true,
          nonew: true,
          regexp: true,
          undef: true,
          unused: false,
          trailing: true,
          sub: true,
          boss: true,
          eqnull: true,
          laxcomma: true,
          node: true,
          es5: true,
          laxbreak: true,
          strict: false
        },
        globals: {}
      },
      tests: {
        files: { src: 'test/**/*.js' }
      },
      nodejs: {
        files: { src: ['*.js', 'lib/**/*.js', 'bin/*'] },
        options: {
          globals: {}
        }
      }
    },

    server: {
      port: 3501,
      base: '.'
    }
  });

  grunt.registerTask('build', 'intro lint');
};
