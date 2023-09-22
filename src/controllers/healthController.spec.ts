import supertest from "supertest";
import { app, server } from "../app";

describe("userController test", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /health", () => {
    test("response with success", async () => {
      const response = await supertest(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual("Backend is healthy");
    });
  });
});
