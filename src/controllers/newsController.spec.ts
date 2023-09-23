import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { app, server } from "../app";
import { testData } from "../testData";
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

  type UpdateDataType = { description: string };

  describe("GET /v1/news", () => {
    test("response with success", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
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
      const d = testData.noNewsDetail;
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
      const d = testData.noNewsDetail;
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

  describe("GET /v1/news/:title/all", () => {
    test("response with success", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({ data: d });
      const news = await prisma.news.findUnique({
        where: { title: d.title },
        select: { title: true, description: true, newsDetail: true },
      });

      const response = await supertest(app).get(`/v1/news/${d.title}/all`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(news);
    });
  });

  describe("POST /v1/news", () => {
    test("response with success", async () => {
      const body = testData.noNewsDetail;
      const response = await supertest(app).post("/v1/news").send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(body);

      const news = await prisma.news.findMany();
      expect(news.length).toBe(1);
    });
    test("ERROR: duplicate", async () => {
      const body = testData.noNewsDetail;
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
      const d = testData.noNewsDetail;
      const missingKeyBody = { title: d.title };
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
      const d = testData.noNewsDetail;
      const invalidKeyBody = {
        invalidKey: d.title,
        description: d.description,
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
      const d = testData.noNewsDetail;
      const invalidTypeBody = {
        title: d.title,
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
      const d = testData.noNewsDetail;
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
      expect(updatedNews?.title).toEqual(d.title);
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
      const d = testData.noNewsDetail;
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
      const d = testData.noNewsDetail;
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
        Object.values(testData).map(async d => {
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
      // delete news detail as well
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
  });
  describe("DELETE /v1/news/:title", () => {
    test("response with success", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const d = testData.withNewsDetail;
      const response = await supertest(app).delete(`/v1/news/${d.title}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: `Deleted ${d.title}` });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(2);
      // delete news detail as well
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
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
