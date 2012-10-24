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
  this.desc('This generator creates a node.js app structure.');
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
    self.bin = (/y/i).test(props.bin);
    self.mit = (/y/i).test(props.mit);
    self.coverage = (/y/i).test(props.coverage);
    ['name', 'description', 'author'].forEach(function(prop) {
      self[prop] = props[prop];
    });
    cb();
  });
};
Generator.prototype.appStructure = function appStructure() {
  this.directory('../app', '.', true);
};
Generator.prototype.mitLicense = function mitLicense() {
  this.template('LICENSE');
};
Generator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};
Generator.prototype.makefile = function makefile() {
  this.template('Makefile');
};
Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};
Generator.prototype.indexFile = function indexFile() {
  this.template('index.js');
};
Generator.prototype.readme = function readme() {
  this.template('README.md');
};
Generator.prototype.docsFile = function docsFile() {
  this.template('docs/index.html');
};
Generator.prototype.finalize = function finalize() {
  var cb = this.async()
    , self = this;

  exec('npm install', function (err, stdout, stderr) {
    if (stdout) self.log.writeln(stdout);
    if (err) self.log.error(stderr);
    cb();
  });
};
