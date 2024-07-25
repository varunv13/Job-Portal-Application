import express from "express";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";

const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/userController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);
router.put("/user-update", isLoggedIn, updateUser);

export default router;
