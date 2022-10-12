const cloudinary = require("../utils/cloudinary");
const { Order, OrderItem, Course } = require("../models");

const AppError = require("../utils/appError");
//fs ทำเกี่ยวกับไฟล
const fs = require("fs");
const { Order_status_one, Order_status_two } = require("../config/constants");

exports.createOrder = async (req, res, next) => {
  if (req.user.role === "admin") {
    throw new AppError("password is invalid", 400);
  }
  try {
    const updateValue = req.body;

    //file ที่ถูก upload.fields จะถูกใส่ไว้ใน req.files โดยไฟลรูปจะอยู่ใน public/image
    // console.log("req.files", req.files);
    //ต้องเอาpath: secure_url ซึ่งจะอยู่บนคาว ไปเก็บไว้ที่ DB
    //ขึ้นคาว
    // console.log(updateValue);
    console.log(req.user);
    if (typeof updateValue.payment !== "string") {
      throw new AppError("payment is invalid", 400);
    }

    if (req.files.slipPayment) {
      const secureUrl = await cloudinary.upload(
        req.files.slipPayment[0].path,
        updateValue.slipPayment
          ? cloudinary.getPublicId(updateValue.slipPayment)
          : undefined
      );
      updateValue.slipPayment = secureUrl;
      //ลบไฟลรูป
      fs.unlinkSync(req.files.slipPayment[0].path);
    }

    if (updateValue.payment && updateValue.slipPayment) {
      updateValue.status = Order_status_two;
    } else {
      updateValue.status = Order_status_one;
    }
    const item = await Order.create({
      codePurchase:
        new Date().getTime() + "" + Math.round(Math.random() * 100000000),
      payment: updateValue.payment,
      slipPayment: updateValue.slipPayment,
      status: updateValue.status,
      UserId: req.user.id,
    });

    const order = await Order.findOne({
      where: { id: item.id },
    });

    const arr = JSON.parse(updateValue.orderItems);

    for (let item of arr) {
      await OrderItem.create({
        OrderId: order.id,
        CourseId: item.id,
      });
    }

    const orders = await Order.findAll({
      where: { id: item.id },
      attributes: { exclude: "userId" },
      include: [
        {
          model: OrderItem,
          as: "Itemeachorder",
          include: [{ model: Course, as: "Detailorder" }],
        },
      ],
    });
    // res.status(200).json("success");
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};
