#
# Vars
#

BIN = ./node_modules/.bin
.DEFAULT_GOAL := all

#
# Tasks
#

test:
	@${BIN}/tape test/*.js

validate:
	@standard

all: validate test

init:
	@git init
	@git add .
	@git commit -am "FIRST"
	@hub create joshrtay/hydra-function-router -d "A hydraform function router."
	@travis enable
	@git push -u origin master

#
# Phony
#

.PHONY: test validate all init
