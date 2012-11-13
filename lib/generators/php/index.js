/*jshint node:true es5:true */
var util = require('util')
  , path = require('path')
  , yeoman = require('yeoman')
  , grunt = require('grunt')
  , _ = grunt.util._
  , exec = require('child_process').exec;

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.desc('This generator creates a php project structure.');
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor(argument) {
  var cb = this.async()
    , self = this
    , packages =  {
        "slim": { "name": "slim/slim", "version": "2.*" }
      , "slimextras": { "name": "slim/extras", "version": "dev-master" }
      , "twig": { "name": "twig/twig", "version": "1.*" }
      , "phpunit": { "name": "phpunit/phpunit", "version": "3.7.*" }
      , "fbsdk": { "name": "facebook/php-sdk", "version": "dev-master" }
    };

  // https://gist.github.com/1677679 @TODO
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
      name: 'coverage'
    , message: 'Would you like to include jscoverage as documentation?'
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
    ['bin', 'mit', 'coverage', 'backbone'].forEach(function(prop) {
      self[prop] = (/y/i).test(props[prop]);
    });

    var required = {};
    Object.keys(packages).forEach(function(prop) {
      var pack = packages[prop];
      if ((/y/i).test(props[prop])) {
        required[pack.name] = pack.version;
        self[prop] = true;
      }
    });
    if (self.slim && self.twig) {
      required[packages.slimextras.name] = packages.slimextras.version;
    }
    self.require = JSON.stringify(required);

    ['name', 'description', 'author'].forEach(function(prop) {
      self[prop] = props[prop];
    });
    cb();
  });
};
Generator.prototype.appStructure = function appStructure() {
  this.directory('../app', '.', true);
};
Generator.prototype.twigTemplates = function twigTemplates() {
  if (!this.twig) return;
  this.directory('../twig', 'app', true);
  this.template('app/templates/layout.html');
};
Generator.prototype.backboneStructure = function backboneStructure() {
  if (!this.backbone) return;
  this.directory('../backbone', 'app', true);
};
Generator.prototype.mitLicense = function mitLicense() {
  this.template('LICENSE');
};
Generator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};
Generator.prototype.composerJSON = function composerJSON() {
  this.template('composer.json');
};
Generator.prototype.makefile = function makefile() {
  //this.template('Makefile');
};
Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};
Generator.prototype.appStructure = function appStructure() {
  this.template('app/index.php');
  this.template('app/config.php');
};
Generator.prototype.readme = function readme() {
  this.template('README.md');
};
Generator.prototype.docsFile = function docsFile() {
  this.template('docs/index.html');
};
Generator.prototype.finalize = function finalize() {
  var cb = this.async()
    , self = this
    , tasks = 2;

  function execLog(err, stdout, stderr) {
    if (stdout) self.log.writeln(stdout);
    if (err) self.log.error(stderr);
    if (--tasks === 0) cb();
  }

  this.log.writeln('Running npm install, this might take a while');
  exec('npm install', execLog);

  this.log.writeln('Running composer install, this might take a while');
  exec('composer install', execLog);
};
