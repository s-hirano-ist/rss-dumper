import { Router } from "express";
import {
  getAllNews,
  getNewsByHeading,
  getNewsAndNewsDetailByHeading,
  createNews,
  updateNewsByHeading,
  deleteAllNews,
  deleteNewsByHeading,
} from "../controllers/newsController";

const router = Router();

router.get("/", getAllNews);
router.get("/:heading", getNewsByHeading);
router.get("/:heading/all", getNewsAndNewsDetailByHeading);

router.post("/", createNews);

router.patch("/:heading", updateNewsByHeading);

router.delete("/", deleteAllNews);
router.delete("/:heading", deleteNewsByHeading);

export default router;
