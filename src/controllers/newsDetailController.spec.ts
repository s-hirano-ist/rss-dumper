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

  describe("GET /v1/news-detail", () => {
    test("response with success", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const newsDetail = await prisma.newsDetail.findMany({
        select: {
          title: true,
          url: true,
        },
      });

      const response = await supertest(app).get("/v1/news-detail");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newsDetail);
    });
  });
  describe("GET /v1/news-detail/:id", () => {
    test("response with success", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({ data: d });

      const id = 1; // TODO: delete magic number
      const newsDetail = await prisma.newsDetail.findUnique({
        where: { id: id },
        select: {
          title: true,
          url: true,
          favorite: true,
          published: true,
          quote: true,
          newsId: true,
        },
      });

      const response = await supertest(app).get(`/v1/news-detail/${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newsDetail);
    });
    test("ERROR: row not found", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({ data: d });
      await prisma.news.findUnique({
        where: { title: d.title },
        select: { title: true, description: true },
      });

      const unknownId = 99999;
      const response = await supertest(app).get(`/v1/news-detail/${unknownId}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
    });
    test("ERROR: invalid type", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({ data: d });

      const id = "a";
      const response = await supertest(app).get(`/v1/news-detail/${id}`);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "id" must be a number',
      });
    });
  });
  describe("POST /v1/news-detail/:title", () => {
    test("response with success (with quote)", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const body = testData.withNewsDetail.newsDetail.create[0];

      const response = await supertest(app)
        .post(`/v1/news-detail/${d.title}`)
        .send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(body);

      const newsDetail = await prisma.newsDetail.findMany({
        select: { title: true, url: true, quote: true },
      });
      expect(newsDetail.length).toBe(1);
      expect(newsDetail[0]).toStrictEqual(body);
    });
    test("response with success (no quote)", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const body = testData.withNewsDetail.newsDetail.create[1];
      const response = await supertest(app)
        .post(`/v1/news-detail/${d.title}`)
        .send(body);
      expect(response.status).toBe(201);

      const newsDetail = await prisma.newsDetail.findMany({
        select: { title: true, url: true, quote: false },
      });
      expect(newsDetail.length).toBe(1);
      expect(newsDetail[0]).toStrictEqual(body);
    });
    // no duplicate key
    test("ERROR: missing key", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const missingKeyBody = { url: "https://google.com" };
      const response = await supertest(app)
        .post(`/v1/news-detail/${d.title}`)
        .send(missingKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "title" is required',
      });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
    test("ERROR: invalid key", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const invalidKeyBody = {
        url: "https://google.com",
        invalidKey: "invalid",
      };
      const response = await supertest(app)
        .post(`/v1/news-detail/${d.title}`)
        .send(invalidKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "title" is required. "invalidKey" is not allowed',
      });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
    test("ERROR: validation", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const invalidKeyBody = {
        title: 1,
        quote: 2,
        url: "https:google",
      };
      const response = await supertest(app)
        .post(`/v1/news-detail/${d.title}`)
        .send(invalidKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message:
          'ERROR: "title" must be a string. "url" must be a valid uri. "quote" must be a string',
      });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
    test("ERROR: not found", async () => {
      const body = testData.withNewsDetail.newsDetail.create[0];
      const response = await supertest(app)
        .post(`/v1/news-detail/${body.title}`)
        .send(body);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
  });
});
