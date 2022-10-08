const express = require("express");
const authenticate = require("../middlewares.js/authenticate");
const upload = require("../middlewares.js/upload");
const adminController = require("../controllers/adminController");

const router = express.Router();

//upload.single(fieldname) = request ที่ส่ง มาชื่อคอลัมอะไร,รับ req.body มากี่ตัวก็ได้เเต่มีไบนารี่มาได้เเค่คอลัมเดียวเท่านั้น
//upload.fields จะถูกเก้บไว้ในเครื่อง + path รูปอยู่ที่ req.files
//maxCount : ส่งมาได้กี่รูป
router.post(
  "/createproduct",
  authenticate,
  upload.fields([
    { name: "courseImg", maxCount: 1 },
    { name: "courseLink", maxCount: 1 },
  ]),
  adminController.createProduct
);

router.get("/allItem", adminController.newItem);

router.patch(
  "/updateproduct/:id",
  authenticate,
  upload.fields([
    { name: "courseImg", maxCount: 1 },
    { name: "courseLink", maxCount: 1 },
  ]),
  adminController.updateProduct
);

router.get("/allcategory", adminController.allcategory);

router.get("/edit/:id", adminController.edit);
module.exports = router;
