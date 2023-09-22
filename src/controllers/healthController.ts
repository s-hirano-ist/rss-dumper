import { Request, Response } from "express";

export const healthController = (_: Request, response: Response) => {
  response.status(200).json("Backend is healthy");
  return;
};
