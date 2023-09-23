#!/bin/bash

echo "health"

curl -s http://localhost:8080/health

echo "\n\nv1/news"

echo "Delete all"
curl -s -X DELETE http://localhost:8080/v1/news

echo "\nNormal insert"
curl -s -d '{"title": "testA", "description": "test description A"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news
curl -s -d '{"title": "testB", "description": "test description B"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news
curl -s -d '{"title": "testC", "description": "test description C"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news

echo "\nERROR: Duplicate insert"
curl -s -d '{"title": "testA", "description": "duplicate A"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news

echo "\nERROR: Missing insert key"
curl -s -d '{"title": "missing"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news
echo "\nERROR: Invalid insert key"
curl -s -d '{"invalid": "A"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news
echo "\nERROR: Invalid insert type"
curl -s -d '{"title": 111}' -H 'Content-Type: application/json' http://localhost:8080/v1/news

echo "\nDatabase with data"
curl -s http://localhost:8080/v1/news/
echo ""
curl -s http://localhost:8080/v1/news/testA

echo "\nUpdate row"
curl -s -d '{"description": "updated description"}' -H 'Content-Type: application/json' -X PATCH http://localhost:8080/v1/news/testA

echo "\nERROR: Invalid update key"
curl -s -d '{"invalid": "invalid"}' -H 'Content-Type: application/json' -X PATCH http://localhost:8080/v1/news/testA

echo "\nERROR: Invalid update type"
curl -s -d '{"description": 111}' -H 'Content-Type: application/json' -X PATCH http://localhost:8080/v1/news/testA

echo "\nERROR: Update row not found"
curl -s -d '{"description": "Not found"}' -H 'Content-Type: application/json' -X PATCH http://localhost:8080/v1/news/XXX

echo "\nUpdated  database"
curl -s http://localhost:8080/v1/news/

echo "\nDelete row"
curl -s -X DELETE http://localhost:8080/v1/news/testA

echo "\nERROR: Delete not found"
curl -s -X DELETE http://localhost:8080/v1/news/A

echo "\nDeleted database"
curl -s -X DELETE http://localhost:8080/v1/news/

echo ""
curl -s http://localhost:8080/v1/news/
echo ""
