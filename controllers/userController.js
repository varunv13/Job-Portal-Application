import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import generateToken from '../utils/generateToken.js';


export const registerUser = async (req, res, next) => {
    try {
        let { name, email, password, location, contact } = req.body;
        // validate
        if(!name) {
            next("name is required");
        }

        if(!email){
            next("email is required");
        }

        if(!password){
            next("password is required");
        }

        if(!location){
            next("location is required");
        }

        if(!contact){
            next("contact is required");
        }

        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            next("User already exist");
        }
        else{
            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(password, salt, async (err, hash) => {
                    // console.log(password);
                    if(err) next(err);
                    let user = await userModel.create({
                        name,
                        email,
                        password: hash,
                        location,
                        contact,
                    });
        
                    // console.log(user);
                    let token = generateToken(user);
                    res.cookie("token", token);

                    return res
                    .status(201)
                    .send({
                        success: true,
                        message: "User Created Successfully",
                        user,
                        token
                    });
                });
            });

        }

    } catch (error) {
        next(error);
    }
};

export const loginUser = async(req, res, next) => {
    let { email, password } = req.body;
    // validation
    if(!email || !password) {
        next("Please provide all fields");
    }

    let user = await userModel.findOne({ email });
    if(!user) {
        next("User doesn't exist");
    }
    else{
        // console.log(user.password);
        bcrypt.compare(password, user.password, (err, result) => {
            console.log(result);
            if(result){
                let token = generateToken(user);
                res.cookie("token", token);
                return res
                .send({
                    message: "User Loggeed In succesfully",
                    success: true,
                    user,
                    token
                });
            }
            else{
                next("User or Password is incorrect");
            }
        });
    }
};

export const logoutUser = async(req, res, next) => {
    res.cookie("token", "");
    return res
    .send({
        message: "Logged Out Successfully",
        success: true
    });
};