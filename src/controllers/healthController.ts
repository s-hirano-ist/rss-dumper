import { Request, Response } from "express";

export const healthController = (_: Request, response: Response) => {
  response.send("Backend is healthy");
  return;
};
