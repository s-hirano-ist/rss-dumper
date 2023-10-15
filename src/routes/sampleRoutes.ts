import { Router, Request, Response } from "express";

// move to src/controllers/healthController if used
const sampleController = (_: Request, response: Response) => {
  response.status(200).json("Sample response");
  return;
};

const router = Router();

router.get("/", sampleController);

export default router;
