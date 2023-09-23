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
    { title: "test-a", description: "description A" },
    { title: "test-b", description: "description B" },
    { title: "test-c", description: "description C" },
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
    test("ERROR: row not found", async () => {
      const d = data[0];
      await prisma.news.create({ data: d });
      await prisma.news.findUnique({
        where: { title: d.title },
        select: { title: true, description: true },
      });

      const unknownTitle = "XXX";
      const response = await supertest(app).get(`/v1/news/${unknownTitle}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
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
    test("ERROR: duplicate", async () => {
      const body = data[0];
      await supertest(app).post("/v1/news").send(body);
      const secondResponse = await supertest(app).post("/v1/news").send(body);

      expect(secondResponse.status).toBe(400);
      expect(secondResponse.body).toEqual({
        message: "ERROR: Duplicate Entry",
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(1);
    });
    test("ERROR: missing key", async () => {
      const missingKeyBody = { title: data[0].title };
      const response = await supertest(app)
        .post("/v1/news")
        .send(missingKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "description" is required',
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
    test("ERROR: invalid key", async () => {
      const invalidKeyBody = {
        invalidKey: data[0].title,
        description: data[0].description,
      };
      const response = await supertest(app)
        .post("/v1/news")
        .send(invalidKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "title" is required. "invalidKey" is not allowed',
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
    test("ERROR: invalid type", async () => {
      const invalidTypeBody = {
        title: data[0].title,
        description: 123,
      };
      const response = await supertest(app)
        .post("/v1/news")
        .send(invalidTypeBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "description" must be a string',
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
  });

  describe("PATCH /v1/news/:title", () => {
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
      expect(response.body).toEqual({ message: `Updated ${d.title}` });

      const updatedNews = await prisma.news.findUnique({
        where: { title: d.title },
      });
      expect(updatedNews?.title).toEqual(data[0].title);
      expect(updatedNews?.description).toEqual(body.description);

      const news = await prisma.news.findMany();
      expect(news.length).toBe(1);
    });
    test("ERROR: not found", async () => {
      const description = "updated description";
      const body: UpdateDataType = { description: description };

      const unknownTitle = "XXX";
      const response = await supertest(app)
        .patch(`/v1/news/${unknownTitle}`)
        .send(body);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
    test("ERROR: invalid key", async () => {
      const d = data[0];
      const invalidKeyBody = {
        invalidKey: "updated description",
      };
      const response = await supertest(app)
        .patch(`/v1/news/${d.title}`)
        .send(invalidKeyBody);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message:
          'ERROR: "description" is required. "invalidKey" is not allowed',
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
    test("ERROR: invalid type", async () => {
      const d = data[0];
      const invalidTypeBody = {
        description: 123,
      };
      const response = await supertest(app)
        .patch(`/v1/news/${d.title}`)
        .send(invalidTypeBody);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "description" must be a string',
      });
      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
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
      expect(response.body).toEqual({ message: "Deleted all" });

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
      expect(response.body).toEqual({ message: `Deleted ${d.title}` });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
    test("ERROR: not found", async () => {
      const unknownTitle = "XXX";
      const response = await supertest(app).delete(`/v1/news/${unknownTitle}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(0);
    });
  });
});
