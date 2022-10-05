const express = require("express");
const authenticate = require("../middlewares.js/authenticate");
const upload = require("../middlewares.js/upload");
const userController = require("../controllers/userController");

const router = express.Router();

//upload.single = อัพไบนารี่ที่ส่ง request มาได้ไฟลเดียวเท่านั้น
router.patch(
  "/",
  authenticate,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  userController.updateUser
);

module.exports = router;
