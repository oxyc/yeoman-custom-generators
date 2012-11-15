# yeoman init php

*by Oskar Schöldström*

A yeoman generator for php projects. Currently it isn't very flexible but more
shaped to my personal needs.

## Getting started

1. `mkdir myapp && cd myapp`
2. `npm install git://github.com/oxyc/yeoman-custom-generators.git`
3. `yeoman init php`
4. Choose your configuration
5. `yeoman build`

## Features

* Require.js client structure
* Usemin handler enabled
* Revisioning of filenames
* Compass
* Twitter Bootstap (optional)
* Composer
* Slim, micro PHP framework (optionl)
* Twig (optional)
* Slim-Extras (installed when both slim and twig are chosen)
* Mocha test setup using phantom.js or through your own browser.
* Lint configurations
* Image optimization
* CSS/JS minification
* Doccoh documentation generation
* PHP server built in (not really working properly)

## Project features

### Usage

* `yeoman build` Build the an optimized app to dist/.
* `yeoman test` Run your JS tests in the terminal (browser also works).
* `yeoman docs` Generate documentation to docs/index.html.
* `yeoman server` Starts a simple server. You can specify the directory as a
  target, eg. `yeoman server:docs` will serve the docs folder.
* `yeoman lint` Lint all source code.
* `yeoman watch` Compile compass files on save.
* `yeoman search` Search for JS applications to install.
* `yeoman compass` Run a compass compile.<% if (backbone) { %>
* `yeoman init backbone:model` Generate a Backbone model (@TODO)<% } %>

### Repository structure

* `bin/` contains executable files
* `build/` contains build system files (eg. composer.phar, pre-commit)
* `app/` the application folder where all development should be done.
* `temp/` temporary staging folder for yeoman.
* `dist/` the optimized and distribution ready application
* `docs/` code documentation.
* `node_modules/` modules used by yeoman.
* `test/` contains js tests.

* `composer.json` PHP libraries used and maintained by Composer.
* `Gruntfile.js` Contains the buildsystem logic.
* `package.json` Metadata about your application

### Application structure

* `app/config.php` cross application settings.
* `app/index.php` initializes a page request, should be kept small.
* `app/scripts/` contains all JavaScript.<% if (backbone) { %>
* `app/scripts/app.js` Shared namespace for the client layer
* `app/scripts/main.js` Require.js config and the JS initializer.
* `app/scripts/libs/` Third party JavaScript libraries
* `app/scripts/{collections,models,routes,view}/` Backbone elements. <% } %>
* `app/styles/` Compass stylesheets.<% if (twig) { %>
* `app/templates/` Twig templates.<% } %>
* `app/vendor/` Third party PHP libraries managed by Composer.
* `app/.htaccess` H5BP htaccess file.

### Grunt / Yeoman plugins available

* grunt-doccoh
* grunt-docs-landing
* grunt-rm
* grunt-contrib-connect

### Dependencies

* [Yeoman](http://yeoman.io) (Building)

## Todo

* Test suit
* Clean up code
* Try to split the generator into multiple
* Add PHPUnit
* Add jscoverage, mocha test documentation
* Read up on grunt.log and do it properly
* LiveReload
* Symlink jshintrcs

## License

MIT
