import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app, server } from "../app";
import resetDatabase from "../utils/resetDatabase";

const prisma = new PrismaClient();

describe("userController test", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  const data = [
    { title: "testA", description: "description A" },
    { title: "testB", description: "description B" },
    { title: "testC", description: "description C" },
  ];

  describe("GET /v1/news", () => {
    test("response with success", async () => {
      await Promise.all(
        data.map(async d => {
          await prisma.news.create({
            data: { title: d.title, description: d.description },
          });
        }),
      );

      const news = await prisma.news.findMany({
        select: { title: true, description: true },
      });

      const response = await supertest(app).get("/v1/news");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(news);
    });
  });

  // TODO: more and more tests

  //   describe("GET /users/:id", () => {
  //     test("response with success", async () => {
  //       const user = await prisma.user.create({
  //         data: { id: 1, name: "user1", email: "user1@example.com" },
  //       });

  //       const response = await supertest(sqliteExpress).get("/users/1");
  //       expect(response.status).toBe(200);
  //       expect(response.body.user).toEqual(user);
  //     });
  //   });

  //   describe("POST /users", () => {
  //     test("response with success", async () => {
  //       const body = { id: 1, name: "user1", email: "user1@example.com" };
  //       const response = await supertest(sqliteExpress).post("/users").send(body);
  //       expect(response.status).toBe(200);
  //       expect(response.body.user).toEqual(body);

  //       const users = await prisma.user.findMany();
  //       expect(users.length).toBe(1);
  //     });
  //   });

  //   describe("PUT /users/:id", () => {
  //     test("response with success", async () => {
  //       await prisma.user.create({
  //         data: { id: 1, name: "user1", email: "user1@example.com" },
  //       });

  //       const body = { name: "updated", email: "updated@example.com" };
  //       const response = await supertest(sqliteExpress)
  //         .put("/users/1")
  //         .send(body);
  //       expect(response.status).toBe(200);
  //       expect(response.body.user.name).toEqual(body.name);
  //       expect(response.body.user.email).toEqual(body.email);

  //       const after = await prisma.user.findUnique({ where: { id: 1 } });
  //       expect(after?.name).toEqual(body.name);
  //       expect(after?.email).toEqual(body.email);
  //     });
  //   });

  //   describe("DELETE /users/:id", () => {
  //     test("response with success", async () => {
  //       const user = await prisma.user.create({
  //         data: { id: 1, name: "user1", email: "user1@example.com" },
  //       });

  //       const response = await supertest(sqliteExpress).delete("/users/1");
  //       expect(response.status).toBe(200);
  //       expect(response.body.user).toEqual(user);

  //       const users = await prisma.user.findMany();
  //       expect(users.length).toBe(0);
  //     });
  //   });
});
