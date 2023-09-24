import { Router } from "express";
import {
  getAllNewsDetail,
  getNewsDetailById,
  createNewsDetailByNewsHeading,
  createNewsAndNewsDetail,
  // updateNewsDetailById,
  // deleteAllNewsDetail,
  // deleteNewsDetailById,
} from "../controllers/newsDetailController";

const router = Router();

router.get("/", getAllNewsDetail);
router.get("/:id", getNewsDetailById);

router.post("/create", createNewsAndNewsDetail);
router.post("/create/:heading", createNewsDetailByNewsHeading);

// router.patch("/update/:id", updateNewsDetailById);

// router.delete("/delete", deleteAllNewsDetail);
// router.delete("/delete/:id", deleteNewsDetailById);

export default router;
