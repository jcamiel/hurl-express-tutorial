#!/bin/bash

docker buildx ls
docker buildx inspect

DOCKER_BUILDKIT=1 docker buildx build --push --file docker/Dockerfile --platform linux/amd64,linux/arm64,linux/arm/v8 --tag ghcr.io/jcamiel/hurl-express-tutorial:latest .
