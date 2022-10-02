module.exports = (err, req, res, next) => {
  console.log("555");
  console.log(err);
  //   ชั้น โมเดล
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueContraintError"
  ) {
    console.log(err);
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
