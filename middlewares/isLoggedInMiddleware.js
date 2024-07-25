import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import secretKey from "../utils/secretKey.js";

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next("User is not logged in");
  }
  try {
    let decoded = jwt.verify(token, secretKey);
    // console.log(decoded.id);
    let user = await userModel.findOne({
      email: decoded.email
      // id: decoded.id
    });
    if (!user) {
      return next("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error.message);
  }
};

export default isLoggedIn;
