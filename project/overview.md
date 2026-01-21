This is an expo app used to track various metrics about on a daily basis
It's a personal project meant exclusively for me and my iphone (latest version) so we don't need to worry

## Architecture
1. use `bun` for project management
2. use [expo](https://expo.dev/) to create the app
	1. use [gluestack-ui](https://gluestack.io/) for UI library
3. use [turso + drizzle](https://docs.turso.tech/sdk/ts/orm/drizzle) as a database + orm
	1. production "cloud" database will be stored on my own mac mini that's always online and under a tailscale vpn (already setup)
	2. for development install a instance locally
4. use github actions to push new versions to expo when merged to main
5. offline support - most things should work with no internet support

## App high level
Think of this as a social media app with 1 single user. I want to be able to track everything I feel like it (tags, memos, images, voice memos) and store it with time and location with the eventual goal to analyze patterns and see historical data

## Features:
1. interactions
	- [x] each interaction has date and location associated with it automatically [task](./2026-01-20__feat__date-location.md)
	- [x] tags. store and autosuggest for each as they get created (example "started taking trazodone" or "traveled on a plane") [task](./2026-01-20__feat__tags.md)
		- [x] show list of existing tags (sorted by name)
		- [x] allow create new tags (typing filters list)
	- [x] energy levels - slider from 1 (low) to 10 (high) [task](./2026-01-20__feat__energy-levels.md)
	- [x] mood - slider 1 to 10 [task](./2026-01-21__feat__mood-slider.md)
2. analytics
	- [ ] tbd
3. architecture
	- [x] setup turso for local development [task](./2026-01-21__arch__turso-local-dev.md)
	- [x] use proper database always (no mock) both in app and web mode, no special cases [task](./2026-01-21__arch__unified-database.md)
