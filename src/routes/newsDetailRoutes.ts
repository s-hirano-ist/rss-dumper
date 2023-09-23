import { Router } from "express";
import {
  getAllNewsDetail,
  getNewsDetailById,
  createNewsDetailByNewsHeading,
  // createNewsAndNewsDetail,
  // updateNewsDetailById,
  // deleteAllNewsDetail,
  // deleteNewsDetailById,
} from "../controllers/newsDetailController";

const router = Router();

router.get("/", getAllNewsDetail);
router.get("/:id", getNewsDetailById);

router.post("/:heading", createNewsDetailByNewsHeading);
// router.post("/:title/new", createNewsAndNewsDetail);

// router.patch("/:title", updateNewsDetailById);

// router.delete("/", deleteAllNewsDetail);
// router.delete("/:id", deleteNewsDetailById);

export default router;
