import { Router } from "express";
import {
  getAllNews,
  getNewsByTitle,
  getNewsAndNewsDetailByTitle,
  createNews,
  updateNewsByTitle,
  deleteAllNews,
  deleteNewsByTitle,
} from "../controllers/newsController";

const router = Router();

router.get("/", getAllNews);
router.get("/:title", getNewsByTitle);
router.get("/:title/all", getNewsAndNewsDetailByTitle);

router.post("/", createNews);

router.patch("/:title", updateNewsByTitle);

router.delete("/", deleteAllNews);
router.delete("/:title", deleteNewsByTitle);

export default router;
