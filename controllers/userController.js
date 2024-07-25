import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt, { compare } from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/passwordSetting.js";

export const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, location, contact } = req.body;
    // validate
    if (!name) {
      next("name is required");
    }

    if (!email) {
      next("email is required");
    }

    if (!password) {
      next("password is required");
    }

    if (!location) {
      next("location is required");
    }

    if (!contact) {
      next("contact is required");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      next("User already exist");
    } else {
      const hashedPassword = await hashPassword(password);
      let user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        location,
        contact,
      });

      let token = generateToken(user);
      res.cookie("token", token);

      return res.status(201).send({
        success: true,
        message: "User Created Successfully",
        user,
        token,
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const loginUser = async (req, res, next) => {
  let { email, password } = req.body;
  // validation
  if (!email || !password) {
    next("Please provide all fields");
  }

  let user = await userModel.findOne({ email });
  if (!user) {
    next("User doesn't exist");
  } else {
    const result = await comparePassword(password, user.password);
    // console.log(result);
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);

      return res.send({
        message: "User Loggeed In succesfully",
        success: true,
        user,
        token,
      });
    } else {
      next("User or Password is incorrect");
    }
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email, password, location, contact } = req.body;

  try {
    const user = await userModel.findById(req.user._id);
    // console.log(req.body);
    if (!user) return next("User doesn't exist.");

    let hashedPassword = password
      ? await hashPassword(password)
      : user.password;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword,
        location: location || user.location,
        contact: contact || user.contact,
      },
      {
        new: true,
      }
    );

    // console.log(updatedUser);

    const token = generateToken(updatedUser);
    res.cookie("token", token);

    res.send({
      message: "User updated succesfully",
      success: true,
      updatedUser,
      token,
    });
  } catch (error) {
    next(error.message);
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "");
  return res.send({
    message: "Logged Out Successfully",
    success: true,
  });
};
