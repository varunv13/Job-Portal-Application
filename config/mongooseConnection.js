import mongoose, { mongo } from "mongoose";
import config from "config"; // helps to manage the configuration settings for you applications across multiople environments
import debug from "debug";

const mongooseDebug = debug("development:mongoose");
const mongodbUri = `${config.get('MONGODB_URI')}/job-portal`;

mongoose
.connect(mongodbUri)
.then(function() {
    mongooseDebug("connected");
})
.catch((err) => { mongooseDebug(err) });

export default mongoose.connections;