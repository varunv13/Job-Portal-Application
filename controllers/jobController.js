import jobModel from "../models/jobsModel.js";

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
