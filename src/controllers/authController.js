const AppError = require("../utils/appError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const gentoken = (playload) =>
  jwt.sign(playload, process.env.JWT_SECRECT_KEY || "private_key", {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
exports.register = async (req, res, next) => {
  try {
    //Username,Password,Firstname,Lastname,Email,tel
    const {
      username,
      password,
      confirmpassword,
      firstName,
      lastName,
      email,
      profileImage,
      phone,
    } = req.body;

    if (!username) {
      throw new AppError("username is require", 400);
    }
    if (!password) {
      throw new AppError("password is require", 400);
    }
    if (
      !password ==
      RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,10}")
    ) {
      throw new AppError(
        "password must containe one digit or one uppercase character or one special character",
        400
      );
    }
    if (password !== confirmpassword) {
      throw new AppError("password and confirm password did not match", 400);
    }
    if (!firstName || !lastName) {
      throw new AppError("firstname or lastname is require", 400);
    }
    if (!phone) {
      throw new AppError("phone is require", 400);
    }
    if (!email) {
      throw new AppError("email is require", 400);
    }
    const isEmail = validator.isEmail(email + "");
    const isPhone = validator.isMobilePhone(phone + "");
    if (isEmail && isPhone) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phone,
      });
      const token = gentoken({ id: user.id });
      res.status(201).json({ token });
    } else {
      throw new AppError("email or phone is valid format");
    }
  } catch (err) {
    console.log("88888");
    next(err);
  }
};