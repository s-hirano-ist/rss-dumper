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

## 🪝 Tags

```bash
git tag vx.x.x
git push origin vx.x.x
```

## References

Express, Prisma, REST API

> https://zenn.dev/yamo/articles/prisma-express-rest-api

ディレクトリ構成

> https://medium.com/codechef-vit/a-better-project-structure-with-express-and-node-js-c23abc2d736f

ExpressにTypeScript導入

> https://reffect.co.jp/node-js/express-typescript/

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
