import express from "express";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  jobStats,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/create-job", isLoggedIn, createJob);
router.get("/get-jobs", isLoggedIn, getAllJobs);
router.patch("/update-jobs/:_id", isLoggedIn, updateJob);
router.delete("/delete-jobs/:_id", isLoggedIn, deleteJob);
router.get("/job-stats", isLoggedIn, jobStats);

export default router;
