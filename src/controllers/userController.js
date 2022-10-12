const cloudinary = require("../utils/cloudinary");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
//fs ทำเกี่ยวกับไฟล
const fs = require("fs");

exports.updateUser = async (req, res, next) => {
  try {
    const updateValue = { ...req.body };
    //file ที่ถูก upload.fields จะถูกใส่ไว้ใน req.files โดยไฟลรูปจะอยู่ใน public/image
    // console.log("req.files", req.files);
    //ต้องเอาpath: secure_url ซึ่งจะอยู่บนคาว ไปเก็บไว้ที่ DB
    //ขึ้นคาว
    // console.log(updateValue);
    if (typeof updateValue.password !== "string") {
      throw new AppError("password is invalid", 400);
    }

    const useredit = await User.findOne({
      where: { id: req.user.id },
    });

    const isCorrect = await bcrypt.compare(
      updateValue.password,
      useredit.password
    );

    if (!isCorrect) {
      throw new AppError("password is invalid", 400);
    }

    if (isCorrect) {
      if (!req.files.profileImage) {
        updateValue.profileImage = null;
      }
      if (req.files.profileImage) {
        const profileImage = req.user.profileImage;

        const secureUrl = await cloudinary.upload(
          req.files.profileImage[0].path,
          profileImage ? cloudinary.getPublicId(profileImage) : undefined
        );
        updateValue.profileImage = secureUrl;
        //ลบไฟลรูป
        fs.unlinkSync(req.files.profileImage[0].path);
      }
      if (updateValue.Newpassword) {
        var hashedPassword_edit = await bcrypt.hash(
          updateValue.Newpassword,
          10
        );
        updateValue.password = hashedPassword_edit;
      }
    }

    await User.update(
      {
        password: hashedPassword_edit,
        profileImage: updateValue.profileImage,
        firstName: updateValue.firstName,
        id: updateValue.id,
      },
      { where: { id: req.user.id } }
    );

    //findone อีกรอบ, reload()
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: "password" },
    });

    // res.status(200).json("success");
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
