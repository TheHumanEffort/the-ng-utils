SRC=src
TEMPLATES_JS=src/.templates.js
MODULE=the-utils
JS_COMPONENTS=$(shell find src/components -name '*.js')
TARGET=index.js

build: $(TARGET)

release: build
	@echo Latest version: $(shell git tag | tail -n 1)
	@while [ -z "$$VERSION" ]; do \
    read -r -p "Version: " VERSION;\
  done && \
	while [ -z "$$MESSAGE" ]; do \
        read -r -p "Message: " MESSAGE; \
  done && \
	( node_modules/.bin/json -I -f package.json -e "this.version = '$$VERSION';"; \
		git add $(TARGET) package.json; \
		git commit -m "Compiled: $$MESSAGE"; \
		git tag -a $$VERSION -m "Release $$VERSION"; \
	)
	git push origin master --follow-tags

$(TEMPLATES_JS): $(shell find $(SRC)/components -name '*.html')
	@echo "Compiling templatecache..."
	@echo 'angular.module("$(MODULE)").run(["$$templateCache",function($$templateCache) {' > $@
# somewhat complex encoding of the file for embedding in JS, replaces newlines with spaces, double-quotes with '\"', and
# ensures that single-quotes are transported (through echo's shell-expansion) correctly into the final document
# see http://stackoverflow.com/questions/1250079/how-to-escape-single-quotes-within-single-quoted-strings for an explanation
# of the former
	@$(foreach file,$^,echo '$$templateCache.put("$(file:src/%=the-utils/%)","$(shell cat $(file) | tr '\n' ' ' | sed 's/"/\\"/g' | sed 's/'\''/'\''\\'\'''\''/g' )");' >> $@;)
	@echo '}]);' >> $@
	@echo "Done."

$(TARGET): src/_init.js $(JS_COMPONENTS) $(TEMPLATES_JS)
	cat $^ > $@

watch:
	watchman-make -p 'src/**/*' -t $(TARGET)
