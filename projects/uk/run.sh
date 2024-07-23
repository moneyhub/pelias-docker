#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]
then
    echo "Please provide the path to tx input file, path to write tx output file and raw description column name as arguments"
    exit 1
fi

node ./resources/run-locally.js --inputTxsLocation "$1" --outputTxsLocation "$2" --searchConcurrency "$3" --transactionConcurrency "$4"
