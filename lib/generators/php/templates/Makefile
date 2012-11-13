REPORTER?=spec
DOCS=docs/*.md
HTMLDOCS=$(DOCS:.md=.html)
APP=<%= grunt.util._.classify(name) %>
LIB=lib
ARCHIVE=$(APP).tar.gz

all: lint

# Yeoman mappings -------------------------------------------------------------
lint:
	@yeoman lint

build:
	@yeoman build

# Documentation ---------------------------------------------------------------

<% if (coverage) { %>
docs: docs-coverage docs-docco docs-tests

docs-coverage:
	@rm -rf $(LIB)-cov
	@jscoverage $(LIB) $(LIB)-cov
	@RUN_COVERAGE=1 $(MAKE) -s test REPORTER=html-cov > docs/coverage.html
<% } else { %>
docs: docs-docco docs-tests
<% } %>

docs-docco:
	@cat lib/*.js > docs/source.js
	@./node_modules/docco/bin/docco docs/*.js
	@rm -f docs/source.js

docs-tests: test-md $(patsubst %.md,%.html,$(wildcard docs/*.md))

%.html: %.md
	@cat docs/layout/head.html > $@
	@./node_modules/marked/bin/marked --gfm $< >> $@
	@cat docs/layout/foot.html >> $@

# Test ------------------------------------------------------------------------

test: test-spec

test-all: lint
	@$(MAKE) test REPORTER=dot

test-spec:
	@./node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			test/*.js

test-md:
	@$(MAKE) -s test REPORTER=markdown > docs/tests.md

# Package and cleanup ---------------------------------------------------------

package: build clean
	@tar czf $(ARCHIVE) \
		--exclude=.git \
		*

clean:
	@rm -rf $(LIB)-cov *.tar.gz docs/*.md

.PHONY: test test-all test-spec test-md docs clean package
