import { Router } from "express";
import { healthController } from "../controllers/healthController.ts";

const router = Router();

router.get("/", healthController);

export default router;
