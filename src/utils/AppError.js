// err = new  Error ("bug",400)
module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
};
