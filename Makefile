TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000
MOCHA = ./node_modules/mocha/bin/_mocha
PATH := ./node_modules/.bin:$(PATH)

lint:
	eslint --fix .

test: lint
	@mocha -t $(TIMEOUT) -R spec $(TESTS) --exit

test-cov:
	@nyc --reporter=html --reporter=text \
		mocha -t $(TIMEOUT) -R spec $(TESTS) --exit

test-coveralls:
	@nyc mocha -t $(TIMEOUT) -R spec $(TESTS) --exit
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@nyc report --reporter=text-lcov | coveralls

.PHONY: test
