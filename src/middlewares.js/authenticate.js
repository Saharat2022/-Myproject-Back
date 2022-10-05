const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer")) {
      // throw new AppError = บังคับให้ error จะวิ่งไปที่ เออเร่อทันที
      throw new AppError("unauthenticated", 401);
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new AppError("unauthenticated", 401);
    }

    const playload = jwt.verify(
      token,
      process.env.JWT_SECRECT_KEY || "private_key"
    );

    const user = await User.findOne({
      where: { id: playload.id },
      attributes: { exclude: "password" },
    });
    if (!user) {
      throw new AppError("unauthenticated or user not found", 401);
    }
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
