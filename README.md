# ExLinks

## Building

1. Install [Node.js](http://nodejs.org/).
2. Install [grunt](https://github.com/cowboy/grunt) with `npm install -g grunt`.
3. Clone ExLinks.
4. Navigate to the directory.
5. Install dependencies with `npm install`.
6. Build with `grunt`.

## Developing

* Run `grunt watch` for continuous builds.
* Run `grunt images` to rebuild `images.json`.

## Releasing a new version

1. Run `grunt patch/minor/major release`.
2. Push to remote with `grunt push`.