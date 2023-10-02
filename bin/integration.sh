#!/bin/sh
# Run integration test against a Docker container of our project
# Example:
# $ integration.sh http://localhost:3000
# In this case http://localhost:3000 is where our server is reachable and exposed
set -eu

wait_for_url () {
    echo "Testing $1..."
    printf 'GET %s\nHTTP 200' "$1" | hurl --retry "$2" > /dev/null;
    return 0
}

echo "Starting app container"
docker run --rm --detach --publish 3000:3000 --name movies ghcr.io/jcamiel/hurl-express-tutorial:latest

echo "Starting app instance to be ready"
wait_for_url "$1" 60

echo "Running Hurl tests"
hurl --variable host="$1" --test --color integration/*.hurl

echo "Stopping app instance"
docker stop movies
