import { Router } from "express";
import {
  getAllNewsDetail,
  getNewsDetailById,
  createNewsDetailByNewsTitle,
  // createNewsAndNewsDetail,
  // updateNewsDetailById,
  // deleteAllNewsDetail,
  // deleteNewsDetailById,
} from "../controllers/newsDetailController";

const router = Router();

router.get("/", getAllNewsDetail);
router.get("/:id", getNewsDetailById);

router.post("/:title", createNewsDetailByNewsTitle);
// router.post("/:title/new", createNewsAndNewsDetail);

// router.patch("/:title", updateNewsDetailById);

// router.delete("/", deleteAllNewsDetail);
// router.delete("/:id", deleteNewsDetailById);

export default router;
