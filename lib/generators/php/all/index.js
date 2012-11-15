/*jshint node:true es5:true */
var util = require('util')
  , path = require('path')
  , fs = require('fs')
  , yeoman = require('yeoman')
  , grunt = require('grunt')
  , packages =  require('../packages')
  , _ = grunt.util._
  , exec = require('child_process').exec;

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));
  this.desc('This generator creates a php project structure.');
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor(argument) {
  var cb = this.async()
    , self = this;

  var prompts = [{
      name: 'bin'
    , message: 'Would you like to include an executable bin file?'
    , default: 'Y/n'
  }, {
      name: 'slim'
    , message: 'Do you want to use slim as micro framework?'
    , default: 'Y/n'
  }, {
      name: 'twig'
    , message: 'Do you want to use twig as a template engine for slim?'
    , default: 'Y/n'
  }, {
      name: 'fbsdk'
    , message: 'Do you want to include the Facebook SDK?'
    , default: 'Y/n'
  }, {
      name: 'backbone'
    , message: 'Do you want to scaffold a backbone client structure as well?'
    , default: 'Y/n'
  }, {
      name: 'sassBootstrap'
    , message: 'Would you like to include Twitter Bootstrap for sass?'
    , default: 'Y/n'
  }, {
      name: 'jsBootstrap'
    , message: 'Would you like to include Twitter Bootstrap JS plugins?'
    , default: 'Y/n'
  }, {
      name: 'mit'
    , message: 'Would you like to include a MIT license?'
    , default: 'Y/n'
  }, {
      name: 'name'
    , message: 'What\'s the name of this application?'
  }, {
      name: 'description'
    , message: 'What\'s the description of this application?'
  }, {
      name: 'author'
    , message: 'What\'s your name?'
  }];

  this.prompt(prompts, function(e, props) {
    if (e) return self.emit('error', e);

    // Straight boolean flags
    ['bin', 'mit', 'backbone', 'slim', 'twig', 'fbsdk', 'sassBootstrap', 'jsBootstrap'].forEach(function(prop) {
      self[prop] = (/y/i).test(props[prop]);
    });

    // Set up composer packages to be installed
    self.require = composerRequires(packages, self);

    // String flags
    ['name', 'description', 'author'].forEach(function(prop) {
      self[prop] = props[prop];
    });
    cb();
  });
};

function composerRequires(packages, prompt) {
  var required = {};
  // Iterate over known composer packages
  Object.keys(packages).forEach(function(flag) {
    var composer_pack = packages[flag]
      , install = false;

    // Install if explicitly said so
    if (prompt[flag]) install = true;
    // If all childpackages are installed, install parent as well.
    if (!install && composer_pack.children) {
      install = composer_pack.children.every(function(child) {
        return prompt[child];
      });
    }
    if (install) required[composer_pack.name] = composer_pack.version;
  });
  // Indent properly
  var json_string = JSON.stringify(required)
    .replace(/([,{])/g, '$1\n    ')
    .replace(/\}$/, '\n  }')
    .replace(/":"/, '": "');

  return json_string;
}

// Copy over the app structure.
Generator.prototype.appStructure = function appStructure() {
  this.directory('../app', '.', true);
  this.template('app/index.php');
  this.template('app/config.php');
};

// Add twig related files
Generator.prototype.twigTemplates = function twigTemplates() {
  if (!this.twig) return;
  this.directory('../twig', 'app', true);
  this.template('app/templates/layout.html');
};

// Add backbone structure
Generator.prototype.backboneStructure = function backboneStructure() {
  if (!this.backbone) return;
  this.directory('../backbone', 'app', true);
};

// Add backbone structure
Generator.prototype.fetchCompassBootstrap = function fetchCompassBootstrap() {
  if (!this.sassBootstrap && !this.jsBootstrap) return;
  var cb = this.async()
    , self = this;

  this.log.subhead('Twitter Bootstrap');
  this.remote('jlong', 'sass-twitter-bootstrap', 'master', function(err, remote)  {
    if (err) return cb(err);
    if (self.sassBootstrap) {
      // Copy over all scss to a separate bootstrap folder
      var remote_files = remote.cachePath + '/lib/*.scss';

      remote_files = grunt.file.expandFiles(remote_files)
        // Only include filename
        .map(path.basename)
        // Exclude files which will be copied to the styles root directory.
        .filter(function(file) {
          return '_variables.scss bootstrap.scss responsive.scss'.indexOf(file) === -1;
        });

      self.log.ok('Moving bootstrap files into bootstrap subdirectory.');
      remote_files.forEach(function(file) {
        remote.copy('lib/' + file, 'app/styles/bootstrap/' + file);
      });

      ['bootstrap.scss', 'responsive.scss'].forEach(function(file) {
        self.log.ok('Moving ' + file + ' to style root');
        var filepath = remote.cachePath + '/lib/' + file
          , content = grunt.file.read(filepath)
              .replace(/(@import ")/g, '$1bootstrap/')
              .replace(/(@import ")bootstrap\/(variables";)/, '$1$2');

        self.write('app/styles/' + file, content);
      });

      // Also move _variables.scss
      self.log.ok('Moving _variables.scss to style root');
      remote.copy('lib/_variables.scss', 'app/styles/_variables.scss');

      self.log.ok('Moving glyphicons into images folder.');
      remote.directory('img', 'app/img');
    }
    if (self.jsBootstrap) {
      remote.directory('js', 'app/scripts/plugins/bootstrap');
    }
    cb();
  });
};


// Generate license file
Generator.prototype.mitLicense = function mitLicense() {
  if (!this.mit) return;
  this.template('LICENSE');
};

// Generate license file
Generator.prototype.composerDownload = function composerDownload() {
  var cb = this.async()
    , self = this;

  this.log.subhead('Downloading composer');
  exec('curl -s https://getcomposer.org/installer | php -- --install-dir=build', function(err, stdout, stderr) {
    if (stdout) self.log.writeln(stdout);
    if (err) self.log.error(stderr);
    cb();
  });
};

// Generate package file
Generator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};

// Generate composer file
Generator.prototype.composerJSON = function composerJSON() {
  this.template('composer.json');
};

// Generate a Gruntfile
Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

// Generate a README
Generator.prototype.readme = function readme() {
  this.template('README.md');
};

// Finish up the scaffoling by installing the npm and composer packages.
Generator.prototype.finalize = function finalize() {
  var cb = this.async()
    , self = this
    , tasks = 2;

  function execLog(err, stdout, stderr) {
    if (stdout) self.log.writeln(stdout);
    if (err) self.log.error(stderr);
    if (--tasks === 0) cb();
  }

  this.log.subhead('Installing packages, this might take a while');
  exec('npm install', execLog);
  exec('php build/composer.phar install', execLog);
};
