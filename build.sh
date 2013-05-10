#!/bin/bash
# Build the UI.
# This script is written to be run on any system.
# It will install node.js and any necessary NPMs,
# then run grunt to build the UI.

set -e
set -x

cwd=`pwd`
PATH=$PATH:$cwd/node_bin

NODE_VERSION=0.10.5
set +e
node=`which node 2>&1`
ret=$?
set -e
if [ $ret -ne 0 ] || [ ! -x "$node" ]; then
    # TODO:  Pick the right node executable for the environment!!!
    mkdir node_bin
    curl -o node_bin/node.exe http://nodejs.org/dist/v${NODE_VERSION}/node.exe
fi

set +e
npm=`which npm 2>&1`
ret=$?
set -e
if [ $ret -ne 0 ] || [ ! -x "$npm" ]; then
    export clean=yes
    export skipclean=no
    curl https://npmjs.org/install.sh | sh
fi

## Install node.js packages needed for build ##
# npm install

# install the global grunt cli which will use the grunt installed locally in the project
npm install -g grunt-cli

# install all the packages defined in package.json
npm install

# run the UI build
#grunt