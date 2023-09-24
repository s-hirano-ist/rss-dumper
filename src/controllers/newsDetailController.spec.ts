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
        select: { title: true, url: true },
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

      const id = 1; // FIXME: delete magic number
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

      const unknownId = 99999; // FIXME: delete magic number
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
  describe("POST /v1/news-detail/create", () => {
    test("response with success (with quote)", async () => {
      const body = {
        ...testData.withNewsDetail.newsDetail.create[0],
      } as Record<string, string>;
      const originalBody = { ...body };
      body.heading = "sample-heading";
      body.description = "sample description";

      const response = await supertest(app)
        .post("/v1/news-detail/create")
        .send(body);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(originalBody);

      const newsDetail = await prisma.newsDetail.findMany({
        select: { title: true, url: true, quote: true },
      });
      expect(newsDetail.length).toBe(1);
      expect(newsDetail[0]).toStrictEqual(originalBody);
    });
    test("response with success (no quote)", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const body = {
        ...testData.withNewsDetail.newsDetail.create[1],
      } as Record<string, string>;
      const originalBody = { ...body };
      body.heading = "sample-heading";
      body.description = "sample description";

      const response = await supertest(app)
        .post("/v1/news-detail/create")
        .send(body);
      expect(response.status).toBe(201);

      const newsDetail = await prisma.newsDetail.findMany({
        select: { title: true, url: true, quote: false },
      });
      expect(newsDetail.length).toBe(1);
      expect(newsDetail[0]).toStrictEqual(originalBody);
    });
    // no duplicate key
    test("ERROR: missing key", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const missingKeyBody = { url: "https://google.com" };
      const response = await supertest(app)
        .post("/v1/news-detail/create")
        .send(missingKeyBody);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message:
          'ERROR: "heading" is required. "description" is required. "title" is required',
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
        .post("/v1/news-detail/create")
        .send(invalidKeyBody);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message:
          'ERROR: "heading" is required. "description" is required. "title" is required. "invalidKey" is not allowed',
      });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
  });
  describe("POST /v1/news-detail/create/:heading", () => {
    test("response with success (with quote)", async () => {
      const d = testData.noNewsDetail;
      await prisma.news.create({ data: d });
      const body = testData.withNewsDetail.newsDetail.create[0];

      const response = await supertest(app)
        .post(`/v1/news-detail/create/${d.heading}`)
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
        .post(`/v1/news-detail/create/${d.heading}`)
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
        .post(`/v1/news-detail/create/${d.heading}`)
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
        .post(`/v1/news-detail/create/${d.heading}`)
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
        .post(`/v1/news-detail/create/${d.heading}`)
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
      const unknownHeading = "unknown";
      const response = await supertest(app)
        .post(`/v1/news-detail/create/${unknownHeading}`)
        .send(body);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
  });

  describe("PATCH /v1/news-detail/update/:id", () => {
    test("response with success", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({
        data: d,
      });
      const body = {
        title: "updated title",
        url: "https://updated.com",
        quote: "updated quote",
      };

      const id = 1; // FIXME: delete magic number

      const response = await supertest(app)
        .patch(`/v1/news-detail/update/${id}`)
        .send(body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: `Updated ${id}` });

      const updatedNewsDetail = await prisma.newsDetail.findUnique({
        where: { id },
      });
      expect(updatedNewsDetail?.title).toEqual(body.title);
      expect(updatedNewsDetail?.url).toEqual(body.url);
      expect(updatedNewsDetail?.quote).toEqual(body.quote);

      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(3);
    });
    test("ERROR: not found", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({
        data: d,
      });
      const body = {
        title: "updated title",
        url: "https://updated.com",
        quote: "updated quote",
      };
      const unknownId = 999; // FIXME: delete magic number
      const response = await supertest(app)
        .patch(`/v1/news-detail/update/${unknownId}`)
        .send(body);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });
      const news = await prisma.newsDetail.findMany();
      expect(news.length).toBe(3);
    });
    test("ERROR: invalid key", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({
        data: d,
      });
      const invalidTypeBody = {
        title: "updated title",
        description: 123,
        quote: "updated quote",
      };
      const id = 1; // FIXME: delete magic number
      const response = await supertest(app)
        .patch(`/v1/news-detail/update/${id}`)
        .send(invalidTypeBody);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "url" is required. "description" is not allowed',
      });
      const news = await prisma.newsDetail.findMany();
      expect(news.length).toBe(3);
    });
    test("ERROR: invalid type", async () => {
      const d = testData.withNewsDetail;
      await prisma.news.create({
        data: d,
      });
      const invalidTypeBody = {
        title: "updated title",
        url: "invalid URL",
      };
      const id = 1; // FIXME: delete magic number
      const response = await supertest(app)
        .patch(`/v1/news-detail/update/${id}`)
        .send(invalidTypeBody);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "url" must be a valid uri',
      });
      const news = await prisma.newsDetail.findMany();
      expect(news.length).toBe(3);
    });
  });

  describe("DELETE /v1/news-detail/delete", () => {
    test("response with success", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const response = await supertest(app).delete("/v1/news-detail/delete");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Deleted all" });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(3); // news should not be deleted
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(0);
    });
  });
  describe("DELETE /v1/news-detail/delete/:id", () => {
    test("response with success", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const id = 1; // FIXME: delete magic number
      const response = await supertest(app).delete(
        `/v1/news-detail/delete/${id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: `Deleted ${id}` });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(3);
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(2);
    });
    test("ERROR: not found", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const unknownId = 99999; // FIXME: delete magic number
      const response = await supertest(app).delete(
        `/v1/news-detail/delete/${unknownId}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "ERROR: Not found" });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(3);
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(3);
    });
    test("ERROR: not found", async () => {
      await Promise.all(
        Object.values(testData).map(async d => {
          await prisma.news.create({
            data: d,
          });
        }),
      );
      const invalidId = "aaa";
      const response = await supertest(app).delete(
        `/v1/news-detail/delete/${invalidId}`,
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: 'ERROR: "id" must be a number',
      });

      const news = await prisma.news.findMany();
      expect(news.length).toBe(3);
      const newsDetail = await prisma.newsDetail.findMany();
      expect(newsDetail.length).toBe(3);
    });
  });
});
