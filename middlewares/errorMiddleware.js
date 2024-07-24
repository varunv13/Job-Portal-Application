// error middleware
const errorMiddleware = (err, req, res, next) => {
  // console.log(err);
  return res.send({
    success: false,
    message: err,
  });
};

export default errorMiddleware;
