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

router.post("/create", createNews);

router.patch("/update/:heading", updateNewsByHeading);

router.delete("/delete", deleteAllNews);
router.delete("/delete/:heading", deleteNewsByHeading);

export default router;
