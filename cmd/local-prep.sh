#!/bin/bash
npm run dba
node cmd/createUserAndExit.js -u adminymouse -p caution -r admin
npm start
