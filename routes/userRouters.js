import express from "express";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";

const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);

export default router;
