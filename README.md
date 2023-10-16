# RSS Dumper

## Tech Stack

**Language** - [TypeScript](https://www.typescriptlang.org/)  
**Main Framework** - [Express](https://expressjs.com/)  
**ORM** - [Prisma](https://www.prisma.io/)  
**Database** - [PostgreSQL](https://www.postgresql.org/)  
**Test** - [Jest](https://jestjs.io/)  
**Authentication** - [Passport](http://www.passportjs.org/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Linting** - [ESLint](https://eslint.org)  
**Validation** - [Joi](https://joi.dev/)  
**Generate Swagger** - [Tsoa](https://tsoa-community.github.io/docs/)

## Render settings

Add following environments

```env
# DATABASE_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
NODE_VERSION=18.17.1
PORT=8080
```

> https://render.com/docs/node-version

Build command

```bash
yarn
```

Start command

```bash
NODE_ENV=production yarn start
```

## 🍾 Initial setups

```bash
git clone https://github.com/s-hirano-ist/rss-dumper.git
yarn
yarn prisma:dev
yarn tsoa:swagger
yarn tsoa:routes
docker compose up --build -d
```

## API path

- `/api/docs`: Swagger UI
- `/health`: health
- `/v1/news`: Pure REST API
- `/v1/news-detail`: REST API with Swagger auto generation with Tsoa

## Tests

```bash
yarn test
```

## Curl commands

```bash
# GET
curl -s https://rss-dumper.onrender.com/v1/news/
curl -s https://rss-dumper.onrender.com/v1/news/test-a

# POST
curl -s -d '{"heading": "test-a", "description": "test description A"}' -H 'Content-Type: application/json' https://rss-dumper.onrender.com/v1/news/create

# PATCH
curl -s -d '{"description": "updated description"}' -H 'Content-Type: application/json' -X PATCH https://rss-dumper.onrender.com/v1/news/update/test-a

# DELETE
curl -s -X DELETE https://rss-dumper.onrender.com/v1/news/delete/test-a
curl -s -X DELETE https://rss-dumper.onrender.com/v1/news/delete
```

## 🪝 Tags

```bash
git tag vx.x.x
git push origin vx.x.x
```

## Notes

Sanitization to prevent XSS is done by [sanitize-html](https://github.com/apostrophecms/sanitize-html)

No sanitization to prevent SQL injection is needed due to Prisma's prevention.

> https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#sql-injection
