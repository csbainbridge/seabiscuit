#!/bin/bash

# kill "node Processor.js"
pkill -f "node Processor.js "

# now clear betting files from country directories
for folder in `echo /home/seabiscuit/ingestion/*/betting` ;
do
    find ${folder} -type f -exec rm -rf {} \; ;
done
