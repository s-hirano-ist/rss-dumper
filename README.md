# RSS Dumper

## Tech Stack

**Language** - [TypeScript](https://www.typescriptlang.org/)  
**Main Framework** - [Express](https://expressjs.com/)  
**ORM** - [Prisma](https://www.prisma.io/)  
**Database** - [PostgreSQL](https://www.postgresql.org/)  
**test** - [Jest](https://jestjs.io/)  
**Authentication** - [Passport](http://www.passportjs.org/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Linting** - [ESLint](https://eslint.org)  
**Validation** - [Joi](https://joi.dev/)

## 🍾 Initial setups

```bash
git clone https://github.com/s-hirano-ist/blog.git
yarn
yarn prisma:dev
docker compose up --build -d
```

## Tests

```bash
yarn test
```

## Curl commands

```bash
# GET
curl -s http://localhost:8080/v1/news/
curl -s http://localhost:8080/v1/news/test-a

# POST
curl -s -d '{"heading": "test-a", "description": "test description A"}' -H 'Content-Type: application/json' http://localhost:8080/v1/news/create

# PATCH
curl -s -d '{"description": "updated description"}' -H 'Content-Type: application/json' -X PATCH http://localhost:8080/v1/news/update/test-a

# DELETE
curl -s -X DELETE http://localhost:8080/v1/news/delete/test-a
curl -s -X DELETE http://localhost:8080/v1/news/delete
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

## References

Express, Prisma, REST API

> https://zenn.dev/yamo/articles/prisma-express-rest-api

ディレクトリ構成

> https://medium.com/codechef-vit/a-better-project-structure-with-express-and-node-js-c23abc2d736f

ExpressにTypeScript導入

> https://reffect.co.jp/node-js/express-typescript/

Express validator

- this did not work well on supertest with jest.

> https://express-validator.github.io/docs/guides/getting-started
>
> https://blog.capilano-fw.com/?p=5619

### TypeScript

TypeScript導入

```bash
tsc --init
```

Run any file

```bash
yarn ts-node src/xxx.ts
```

### Express

### Prisma

Prisma導入

```bash
npx prisma init
```

Edit database with GUI

```bash
yarn prisma:studio
```

### PostgreSQL

Connect to PostgreSQL

```bash
psql -h 127.0.0.1 -U sola -p 5555 rss-db
```
