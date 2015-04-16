# AcidPlatformer

This is a simple javascript platformer that may evolve over time to be something more.

## How to run

To build the project, first run `npm install` then run `gulp`.

Once all the files are built and in the `dist` folder, run a simple http server from there and open game.html. For an easy to setup and run server, I recommend [http-server](https://github.com/indexzero/http-server).

## To do

* Convert from EaselJS to the latest hotness. [Pixi.js possibly?](http://www.pixijs.com/)
* Remove grunt build from the repo and from package.json.
* Restyle js to follow [Airbnb style guide](https://github.com/airbnb/javascript). Use [JSCS](http://jscs.info/) (possibly with a gulp plugin) to enforce.
* Add gamepad support using [JavaScript Gamepad API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad).
* Add next game features: larger level, background parallax, physics collisions, player damage or death, obstacles and enemies, enemy AI, character fighting controlls, ally AI.
* Add testing.

### Optional

* Use a cdn instead of pulling all the libs in. If so, look into [gulp-cdnizer](https://github.com/OverZealous/gulp-cdnizer).

## Helpful links

* Search for most popular frontend libraries: http://bower.io/search/
* Search for gulp plugins: http://npmsearch.com/
* Free game art: [http://opengameart.org/](http://opengameart.org/art-search-advanced?keys=&field_art_tags_tid_op=and&field_art_tags_tid=Platformer&name=&sort_by=count&sort_order=DESC&items_per_page=24&Collection=) [Good](http://opengameart.org/content/a-platformer-in-the-forest) [examples.](http://opengameart.org/content/old-frogatto-tile-art)
