import express from "express";
import dotEnv from "dotenv/config"; // directly importing and configuring the env. var. files
import mongoose from "./config/mongooseConnection.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import cors from "cors"; //enables cross origin resource sharing in express application
import morgan from "morgan"; // provides a simple way to log requests made to your server
import { fileURLToPath } from "url";

import index from "./routes/index.js";
import userRouters from "./routes/userRouters.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine", "ejs");

// ROUTERS
app.use("/api/v1/", index);
app.use("/api/v1/users", userRouters);

// validation middleware
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT);
