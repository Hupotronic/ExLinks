# ExLinks

## Building

1. Install node.js
2. Install CoffeeScript (it's used for compiling)
3. Install other relevant plugins (`html-minifier`, `uglify-js`)
4. Build with `cake build`. To minify use `--uglify "mangle,squeeze"`

## Developing

* Run `cake dev` for continous builds when relevant script files are updated.
* Run `cake images` to rebuild images.json from the files in `images`.