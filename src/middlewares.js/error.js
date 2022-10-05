module.exports = (err, req, res, next) => {
  // console.log("555");
  // console.log(err);
  //   ชั้น โมเดล
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    // console.log(err);
    err.statusCode = 400;
    //คนอ่านจะได้อ่านรู้เรื่อง
    err.message = err.errors[0].message;
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }
  res.status(err.statusCode || 500).json({ message: err.message });
};
