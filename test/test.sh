#!/bin/bash

# CHANGE THIS FILE TO COMPARE THE OUTPUT.
cd test
sh curl.sh > output.txt

diff -s output.txt correct_output.txt > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Test succeeeded"
elif [ $? -eq 1 ]; then
  echo "Test failed"
fi
