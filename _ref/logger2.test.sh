#!/bin/bash

# Reads in the default LOG_LEVEL value str

# should omit debug log event since default
# is LOG_LEVEL='info'
node logger2.js

sleep 5

# should override the default LOG_LEVEL with
# debug
node logger2.js --log-level=debug