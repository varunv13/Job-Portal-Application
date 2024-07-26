import jobModel from "../models/jobsModel.js";
import mongoose from "mongoose";

export const createJob = async (req, res, next) => {
  try {
    let { company, position } = req.body;

    if (!company) return next("Company name is required");
    if (!position) return next("Position is required");

    // console.log(req.user.id);

    req.body.postedBy = req.user.id;
    const job = await jobModel.create(req.body);
    return res.send({
      message: "Job created Successfully",
      job,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const getAllJobs = async (req, res, next) => {
  let fetchAll = await jobModel.find();
  if (!fetchAll) {
    return res.send({
      message: "No jobs available",
      fetchAll,
    });
  } else {
    return res.send({
      totalJobs: fetchAll.length,
      fetchAll,
    });
  }
};

export const updateJob = async (req, res, next) => {
  // console.log(req.params);
  let { _id } = req.params;
  let { company, position } = req.body;

  if (!company || !position) return next("All fields are requried");

  const job = await jobModel.findOne({ _id });
  if (!job) return next("No job found");

  if (!(req.user.id === job.postedBy.toString())) {
    return next("You're not authorized to update the job");
  }

  const updateJob = await jobModel.findOneAndUpdate({ _id }, req.body, {
    new: true,
    runValidator: true,
  });

  return res.send({
    message: "Job updated Successfully",
    updateJob,
  });
};

export const deleteJob = async (req, res, next) => {
  let { _id } = req.params;
  if (!_id) return next("Please provide the job id which you want to delete");

  const deleteJob = await jobModel.findById({ _id });
  if (!deleteJob) return next("Job doesn't exist");

  if (!(req.user.id === deleteJob.postedBy.toString())) {
    return next("You're not authorized to make any changes.");
  }

  //   console.log(deleteJob);

  await jobModel.deleteOne({ _id });
  return res.send({
    message: "Job deleted successfully",
  });
};

export const jobStats = async (req, res, next) => {
  if (!req.user) return next("You're unauthorised to perform this operation");

  const stats = await jobModel.aggregate([
    {
      // search by user-job
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  if (stats.length === 0) return res.send({ message: "No stats to show" });

  const monthlyApplications = await jobModel.aggregate([
    { $match: { postedBy: new mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const locationBased = await jobModel.aggregate([
    { $match: { postedBy: new mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { location: { $substr: ["$workLocation", 0, 20] } },
        count: { $sum: 1 },
      },
    },
  ]);

  const activeJobs = await jobModel.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
        status: "active",
      },
    },
    {
      $group: {
        _id: {
          location: { $substr: ["$workLocation", 0, 20] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const pendingJobs = await jobModel.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
        status: "pending",
      },
    },
    {
      $group: {
        _id: {
          location: { $substr: ["$workLocation", 0, 20] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const interviewScehduled = await jobModel.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
        status: "interview",
      },
    },
    {
      $group: {
        _id: {
          location: { $substr: ["$workLocation", 0, 20] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const closedJobs = await jobModel.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
        status: "closed",
      },
    },
    {
      $group: {
        _id: {
          location: { $substr: ["$workLocation", 0, 20] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const rejected = await jobModel.aggregate([
    {
      $match: {
        postedBy: new mongoose.Types.ObjectId(req.user.id),
        status: "reject",
      },
    },
    {
      $group: {
        _id: {
          location: { $substr: ["$workLocation", 0, 20] },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  // console.log(activeJobs);

  return res.send({ pendingJobs });
};
