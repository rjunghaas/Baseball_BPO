babel --presets react,es2015 --plugins transform-object-rest-spread js/source -d js/build
browserify js/build -o ./bundle.js
