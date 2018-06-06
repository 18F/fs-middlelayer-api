#!/bin/bash
docker-compose down
docker-compose up --detach postgres && docker-compose up --detach minio
docker-compose run --no-deps web cmd/local-test.sh
docker-compose down

