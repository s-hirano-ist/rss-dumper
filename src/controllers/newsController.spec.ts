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

  type CreateDataType = { title: string; description: string };
  type UpdateDataType = { description: string };

  const data: CreateDataType[] = [
    { title: "testA", description: "description A" },
    { title: "testB", description: "description B" },
    { title: "testC", description: "description C" },
  ];

  describe("GET /v1/news", () => {
    test("response with success", async () => {
      await Promise.all(
        data.map(async d => {
          await prisma.news.create({
            data: d,
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

  describe("GET /v1/news/:title", () => {
    test("response with success", async () => {
      const d = data[0];
      await prisma.news.create({ data: d });
      const news = await prisma.news.findUnique({
        where: { title: d.title },
        select: { title: true, description: true },
      });

      const response = await supertest(app).get(`/v1/news/${d.title}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(news);
    });
  });

  describe("POST /v1/news", () => {
    test("response with success", async () => {
      const body = data[0];
      const response = await supertest(app).post("/v1/news").send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(body);

      const news = await prisma.news.findMany();
      expect(news.length).toBe(1);
    });
  });

  describe("PUT /v1/news/:title", () => {
    test("response with success", async () => {
      const d = data[0];
      await prisma.news.create({
        data: d,
      });
      const description = "updated description";
      const body: UpdateDataType = { description: description };

      const response = await supertest(app)
        .patch(`/v1/news/${d.title}`)
        .send(body);
      expect(response.status).toBe(200);
      const output = { message: `Updated ${d.title}` };
      expect(response.body).toEqual(output);

      const updatedNews = await prisma.news.findUnique({
        where: { title: d.title },
      });
      expect(updatedNews?.title).toEqual(data[0].title);
      expect(updatedNews?.description).toEqual(body.description);
    });
  });

  describe("DELETE /v1/news/", () => {
    test("response with success", async () => {
      await Promise.all(
        data.map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const response = await supertest(app).delete("/v1/news/");
      expect(response.status).toBe(200);
      const output = { message: "Deleted all" };
      expect(response.body).toEqual(output);

      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
  });
  describe("DELETE /v1/news/:title", () => {
    test("response with success", async () => {
      const d = data[0];
      await prisma.news.create({
        data: d,
      });

      const response = await supertest(app).delete(`/v1/news/${data[0].title}`);
      expect(response.status).toBe(200);
      const output = { message: `Deleted ${d.title}` };
      expect(response.body).toEqual(output);

      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
  });
});
