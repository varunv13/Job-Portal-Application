import express from "express";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);
router.put("/user-update", isLoggedIn, updateUser);

export default router;
