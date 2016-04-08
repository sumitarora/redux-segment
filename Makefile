#
# Binaries.
#

BIN = ./node_modules/.bin
BROWSERIFY = $(BIN)/browserify
BABELIFY = ./node_modules/babelify/index.js
TAPE-RUN = $(BIN)/tape-run
TAP-SPEC = $(BIN)/tap-spec
TAP-XUNIT = $(BIN)/tap-xunit
WATCH = $(BIN)/watch
ESLINT = $(BIN)/eslint
BABEL-TAPE-RUNNER = $(BIN)/babel-tape-runner

#
# Files.
#

BUILD_ENTRY = src/index.js
SRC = $(wildcard src/**/*.js)
TESTS = $(wildcard test/*-test.js)


#
# Arguments.
#

BROWSER ?= chrome

BROWSERIFY_ARGS = \
                  -t $(BABELIFY)


#
# Install.
#

node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install
	@touch node_modules

clean:
	@rm -rf node_modules redux-segment.js *.log .tmp
.PHONY: clean


#
# Build.
#

redux-segment.js: # node_modules $(SRC) package.json <-- Disabled due to CircleCI issue (see: https://circleci.com/gh/rangle/redux-segment/33)
	@$(BROWSERIFY) -e $(BUILD_ENTRY) $(BROWSERIFY_ARGS) -s 'redux-segment' -o $@

build: redux-segment.js
.PHONY: build


#
# Test.
#

lint: node_modules
	@$(ESLINT) $(SRC) $(TESTS)

test: node_modules
	@$(BABEL-TAPE-RUNNER) -r 'test/helpers/test-setup.js' $(TESTS)
.PHONY: test

test-dev: node_modules
	@$(MAKE) test | $(TAP-SPEC)
.PHONY: test-dev
.DEFAULT_GOAL = test-dev

test-ci: node_modules
	@$(MAKE) test | tee results | $(TAP-SPEC) && \
		mkdir -p $(CIRCLE_TEST_REPORTS)/TAP && \
		cat results | $(TAP-XUNIT) > $(CIRCLE_TEST_REPORTS)/TAP/results.xml
.PHONY: test-ci

