NODE_MODULES_DIR = node_modules
NODE_IMG = node:7.8-alpine

$(NODE_MODULES_DIR): package.json
	@docker run --rm -v $(CURDIR):/data -w /data \
		morenstrat/foundation-cli:alpine-latest \
		sh -c 'npm install --quiet && bower install --allow-root'

dep: $(NODE_MODULES_DIR)

start: dep
	@docker run --rm -it \
		-v $(CURDIR):/data \
		-w /data \
		-p 9020:9020 \
		$(NODE_IMG) \
		npm run start

build: dep
	@docker run --rm -v $(CURDIR):/data -w /data morenstrat/foundation-cli:alpine-latest sh -c 'foundation build'

watch: dep
	@docker run --name demo -d -v $(CURDIR):/data -w /data -p 8080:8080 \
		morenstrat/foundation-cli:alpine-latest sh -c 'foundation watch'

release:
	@cd build; \
	touch CNAME; \
	echo "ip.imega.club" > CNAME; \
	git init; \
	git config user.name "$(USER_NAME)"; \
	git config user.email "$(USER_EMAIL)"; \
	git add .; \
	git commit -m "deployed to gh-pages"; \
	git push --force --quiet "https://$(GH_TOKEN)@github.com/ippart/front.git" gh-pages:gh-pages;
