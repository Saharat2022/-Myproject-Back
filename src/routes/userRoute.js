const express = require("express");
const authenticate = require("../middlewares.js/authenticate");
const upload = require("../middlewares.js/upload");
const userController = require("../controllers/userController");

const router = express.Router();

//upload.single(fieldname) = request ที่ส่ง มาชื่อคอลัมอะไร,รับ req.body มากี่ตัวก็ได้เเต่มีไบนารี่มาได้เเค่คอลัมเดียวเท่านั้น
//upload.fields จะถูกเก้บไว้ในเครื่อง + path รูปอยู่ที่ req.files
//maxCount : ส่งมาได้กี่รูป
router.patch(
  "/",
  authenticate,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  userController.updateUser
);

module.exports = router;
