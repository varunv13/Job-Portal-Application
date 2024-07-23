import mongoose from "mongoose";
import validator from "validator";

const userSchema =  mongoose.Schema(
    {
        name: {
            type: "String",
            required: true,
            minLength: [3, "Name length is less than 3"]
        },
        email: {
            type: "String",
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: (props) => `${ props.value }`
            },
        },
        password: {
            type: "String",
            required: true,
            minLength: [5, "Password Length is less than 5"]
        },
        location: {
            type: "String",
            default: "India"
        },
        contact: "Number",
    },
    {
        timestamps: true  // will get the time when a new user is created
    }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;