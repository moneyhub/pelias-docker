#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]
then
    echo "Please provide the path to tx input file and path to write tx output file"
    exit 1
fi

node ./resources/run-multi-user.js --inputTxsLocation "$1" --outputTxsLocation "$2"
