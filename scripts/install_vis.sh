#!/bin/bash

cd node_modules/jalangi2
# install bootstrap
# npm install bootstrap

# install d3
# npm install d3

# install nanoscroller
# npm install nanoscroller

# js component that generate curved line to connect dom elements
# npm install connection-line
# cd node_modules
# browserify -r connection-line -o bundle.js
# cd ..
# wget https://jsplumbtoolkit.com/lib/jsPlumb-2.0.7.js
# wget http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js
# wget http://fonts.googleapis.com/css?family=Poiret+One
# wget http://benlogan1981.github.io/VerticalSankey/scripts/sankey.js

# generate mid.html (temp version) from frame.html
node src/js/commands/stringify.js
# generate mid.html (final version) from pre.html and mid.html (temp version)
node src/js/commands/macroexpand.js src/js/pre.html src/js/mid.html