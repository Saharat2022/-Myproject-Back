const multer = require("multer");

//return {} ,ระบุตำเเหน่งที่เก็บไฟลเเละชื่อไฟลใหม่
//cb มีพารามิเตอรื2 (ตัวเก็บเออเรอ, pathที่จะเก็บ)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // public/image เทียบ root path
    cb(null, "public/images");
  },
  //cb มีพารามิเตอรื2 (ตัวเก็บเออเรอ, ชื่อไฟลใหม่)
  filename: (req, file, cb) => {
    // console.log("file", file);
    cb(
      null,
      new Date().getTime() +
        "" +
        Math.round(Math.random() * 100000000) +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

module.exports = multer({ storage });
