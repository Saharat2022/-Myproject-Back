const cloudinary = require("../config/cloudinary");

exports.upload = async (path, publicId) => {
  console.log("upload");
  const option = {
    use_filename: true, //คงชื่อชื่อไฟล์รูปที่เราอัพโหลดไว้เหมือนเดิม
    overwrite: true, //ทับไฟลเดิมได้ไหมถ้าชื่อเดียวกัน ถ้าไม่ได้จะเป็นเลชเวอชั่น
    unique_filename: false, //ไฟลเราunique เพราะถ้าอัพโหลดชื่อไฟลซำ้มันจะทับรูปเก่า
  };

  if (publicId) {
    option.public_id = publicId;
  }
  //cloud
  const res = await cloudinary.uploader.upload(path, option);
  // console.log("res", res);
  return res.secure_url;
};

//https://res.cloudinary.com/dbn6khslm/image/upload/v1665046584/166504658195388728645.jpg from DB
exports.getPublicId = (url) => {
  const splitSlash = url.split("/");
  return splitSlash[splitSlash.length - 1].split(".")[0];
};
