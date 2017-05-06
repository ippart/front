NODE_MODULES_DIR = node_modules
NODE_IMG = node:7.8-alpine

$(NODE_MODULES_DIR): package.json
	@docker run --rm -it -v $(CURDIR):/data -w /data $(NODE_IMG) npm install --quiet

build: $(NODE_MODULES_DIR)
	@docker run --rm -v $(CURDIR):/data -w /data $(NODE_IMG) npm run build

watch: clean $(NODE_MODULES_DIR)
	@docker run -d --name demo -v $(CURDIR):/data -w /data -p 9000:9000 $(NODE_IMG) npm run serve

clean:
	@-docker rm -fv demo

release:
	@cd build; \
	touch CNAME; \
	echo "ip.imega.club" > CNAME; \
	git init; \
	git config user.name "$(USER_NAME)"; \
	git config user.email "$(USER_EMAIL)"; \
	git add .; \
	git commit -m "deployed to gh-pages"; \
	git push --force --quiet "https://$(GH_TOKEN)@github.com/ippart/front.git" master:gh-pages;
