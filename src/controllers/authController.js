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

    // if (!username) {
    //   // next(new AppError (....)) = วิ่งเข้าหา catct
    //   //err = new AppError("username is require", 400)
    //   throw new AppError("username is require", 400);
    // }
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
    if (!email) {
      throw new AppError("email is require", 400);
    }
    const isEmail = validator.isEmail(email + "");
    const isPhone = validator.isMobilePhone(phone + "");
    if (isEmail && isPhone) {
      const hashedPassword = await bcrypt.hash(password, 10);
      //validate SQL before insert into table
      const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phone,
      });
      console.log(user);
      const token = gentoken({ id: user.id });
      //201 = create complete
      res.status(201).json({ token });
    } else {
      throw new AppError("email or phone is valid format and require");
    }
  } catch (err) {
    console.log("catch errrrr");
    console.log(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //protect bcypt string
    if (typeof username !== "string" || typeof password !== "string") {
      throw new AppError("username or password is invalid", 400);
    }
    //select * from users where username = username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new AppError("username or password is invalid", 400);
    }
    // console.log("user", user);
    //password must be string
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new AppError("username or password is invalid", 400);
    }

    const token = gentoken({ id: user.id });
    //200 = select complete
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
