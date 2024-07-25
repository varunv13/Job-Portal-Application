import jwt from "jsonwebtoken";
import secretKey from "./secretKey.js";

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, secretKey);
};

export default generateToken;
