import jwt from "jsonwebtoken";
import secretKey from "./secretKey.js";

const generateToken = (user) => {
    return jwt.sign({ eamil: user.eamil, id: user._id }, secretKey );
}

export default generateToken;