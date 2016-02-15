#!/bin/bash

browserify defer.js -t deamdify -t uglifyify -s heya.defer -o dist/defer.min.js
browserify defer.js -t deamdify -s heya.defer -o dist/defer.js
