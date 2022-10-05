const cloudinary = require("../utils/cloudinary");

exports.updateUser = async (req, res, next) => {
  try {
    //file ที่ถูก upload.fields จะถูกใส่ไว้ใน req.files โดยไฟลจะอยู่ใน public/image
    console.log("req.files", req.files);
    //ต้องเอาpath secure_url ไปเก็บไว้ที่ DB ซึ่งจะอยู่บนคาว
    //ขึ้นคาว
    console.log("res", res);
    await cloudinary.upload(req.files.profileImage[0].path);
    res.status(200).json("success");
  } catch (err) {
    next(err);
  }
};
