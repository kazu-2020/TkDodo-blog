#!/bin/bash

set -ex

until $(curl --output /dev/null --silent --head --fail http://frontend:3000); do
    printf '.'
    sleep 1
done

npx cypress run --browser chrome --headless
