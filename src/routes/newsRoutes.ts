import { Router } from "express";
import {
  createNews,
  updateNewsByHeading,
  deleteAllNews,
  deleteNewsByHeading,
} from "../controllers/newsController";

const router = Router();

router.post("/create", createNews);

router.patch("/update/:heading", updateNewsByHeading);

router.delete("/delete", deleteAllNews);
router.delete("/delete/:heading", deleteNewsByHeading);

export default router;
