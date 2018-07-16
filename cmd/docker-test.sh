#!/bin/bash
docker-compose down
docker-compose up -d minio
docker-compose up -d postgres
mc config host add dockerminio http://localhost:9000 MINIOSERVER MINIOSERVERSECRET
mc mb dockerminio/dockerbucket
docker-compose run --no-deps web cmd/local-test.sh
docker-compose down

