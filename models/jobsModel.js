import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    company: {
      type: "String",
      required: [true, "Company name is required"],
    },
    position: {
      type: "String",
      required: [true, "Position is required"],
    },
    status: {
      type: "String",
      enum: ["pending", "reject", "interview", "active", "closed"],
      default: "pending",
    },
    workType: {
      type: "String",
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: "String",
      required: [true, "Location is required"],
      default: "Bangalore",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const jobModel = mongoose.model("Job", jobSchema);
export default jobModel;
