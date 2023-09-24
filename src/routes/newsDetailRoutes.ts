import { Router } from "express";
import {
  getAllNewsDetail,
  getNewsDetailById,
  createNewsAndNewsDetail,
  createNewsDetailByNewsHeading,
  updateNewsDetailById,
  deleteAllNewsDetail,
  deleteNewsDetailById,
  toggleFavoriteById,
  togglePublishedById,
} from "../controllers/newsDetailController";

const router = Router();

router.get("/", getAllNewsDetail);
router.get("/:id", getNewsDetailById);

router.post("/create", createNewsAndNewsDetail);
router.post("/create/:heading", createNewsDetailByNewsHeading);

router.patch("/update/:id", updateNewsDetailById);
router.patch("/toggle/favorite/:id", toggleFavoriteById);
router.patch("/toggle/published/:id", togglePublishedById);

router.delete("/delete", deleteAllNewsDetail);
router.delete("/delete/:id", deleteNewsDetailById);

export default router;
