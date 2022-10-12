const cloudinary = require("../utils/cloudinary");
const { Course, Category } = require("../models");

const AppError = require("../utils/appError");
//fs ทำเกี่ยวกับไฟล
const fs = require("fs");

exports.createProduct = async (req, res, next) => {
  try {
    const createValue = { ...req.body };
    console.log(req.files);
    if (
      (!createValue.nameProduct || !createValue.nameProduct.trim()) &&
      (!createValue.descriptionCourse ||
        !createValue.descriptionCourse.trim()) &&
      (!createValue.priceProduct || !createValue.priceProduct.trim()) &&
      // (!createValue.courseLink || !createValue.courseLink.trim()) &&
      !req.files
    ) {
      throw new AppError("Data is required", 400);
    }
    if (!typeof createValue.priceProduct === "number") {
      throw new AppError("Data is invalid", 400);
    }
    console.log(createValue);
    if (!createValue.subject) {
      throw new AppError("subject is invalid", 400);
    }

    const categoryid = await Category.findOne({
      where: { subject: createValue.subject.trim().toUpperCase() },
    });

    if (categoryid) {
      createValue.CategoryId = categoryid.id;
      if (req.files.courseImg) {
        const courseImg = req.user.courseImg;

        const secureUrl = await cloudinary.upload(
          req.files.courseImg[0].path,
          courseImg ? cloudinary.getPublicId(courseImg) : undefined
        );
        createValue.courseImg = secureUrl;
        //ลบไฟลรูป
        fs.unlinkSync(req.files.courseImg[0].path);
      }
      if (req.files.courseLink) {
        const courseImg = req.user.courseLink;

        const secureUrl = await cloudinary.upload(
          req.files.courseLink[0].path,
          courseImg ? cloudinary.getPublicId(courseLink) : undefined
        );
        createValue.courseLink = secureUrl;
        //ลบไฟลรูป
        fs.unlinkSync(req.files.courseLink[0].path);
      }
    } else {
      throw new AppError("Subject not Found", 400);
    }

    if (!createValue.type) {
      createValue.type = "offline";
    }
    if (!createValue.courseLink) {
      createValue.courseLink = null;
    }

    const newCourse = await Course.create({
      nameProduct: createValue.nameProduct,
      descriptionCourse: createValue.descriptionCourse,
      priceProduct: createValue.priceProduct,
      descriptionLast: createValue.descriptionLast,
      courseImg: createValue.courseImg,
      courseLink: createValue.courseLink,
      type: createValue.type,
      inventory: createValue.inventory,
      CategoryId: createValue.CategoryId,
    });

    //findone อีกรอบ, reload()
    const item = await Course.findOne({
      where: { id: newCourse.id },
      attributes: { exclude: "subjectcourse" },
      include: [{ model: Category, as: "subjectcourse" }],
    });

    // res.status(200).json("success");
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
};

exports.newItem = async (req, res, next) => {
  try {
    const allitem = await Course.findAll({
      include: [{ model: Category, as: "subjectcourse" }],
    });
    if (!allitem) {
      throw new AppError("Not Found", 400);
    }
    res.status(200).json({ allitem });
  } catch (err) {
    next(err);
  }
};
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteItem = await Course.destroy({
      where: { id: id },
    });

    if (!deleteItem) {
      throw new AppError("Not Found Item", 400);
    }

    res.status(200).json({ message: "Success Delete" });
  } catch (err) {
    next(err);
  }
};

exports.allcategory = async (req, res, next) => {
  try {
    const category = await Category.findAll();
    if (!category) {
      throw new AppError("Not Found Category", 400);
    }
    res.status(200).json({ category });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updateValue = { ...req.body };
    const { id } = req.params;
    if (
      (!updateValue.nameProduct || !updateValue.nameProduct.trim()) &&
      (!updateValue.descriptionCourse ||
        !updateValue.descriptionCourse.trim()) &&
      (!updateValue.priceProduct || !updateValue.priceProduct.trim()) &&
      !req.files
    ) {
      throw new AppError("Data is required", 400);
    }
    if (!typeof updateValue.priceProduct === "number") {
      throw new AppError("Data is invalid", 400);
    }
    // console.log(updateValue);
    if (!updateValue.subject) {
      throw new AppError("subject is invalid", 400);
    }
    console.log(req.body, "body");
    const courseEdit = await Course.findOne({
      where: { id: id },
    });

    let oldCourseImg = courseEdit.courseImg;
    let oldCourseLink = courseEdit.courseLink;
    console.log(oldCourseImg, "old");

    if (req.files.courseImg) {
      const secureUrl = await cloudinary.upload(
        req.files.courseImg[0].path,
        oldCourseImg ? cloudinary.getPublicId(oldCourseImg) : undefined
      );
      updateValue.courseImg = secureUrl;
      //ลบไฟลรูป
      fs.unlinkSync(req.files.courseImg[0].path);
    }
    if (req.files.courseLink) {
      const secureUrl = await cloudinary.upload(
        req.files.courseLink[0].path,
        oldCourseLink ? cloudinary.getPublicId(oldCourseImg) : undefined
      );
      updateValue.courseLink = secureUrl;
      //ลบไฟลรูป
      fs.unlinkSync(req.files.courseLink[0].path);
    }
    const categoryId = Category.findOne({
      subject: updateValue.subject.trim().toUpperCase(),
    });

    await Course.update(
      { ...updateValue, CategoryId: categoryId.id },
      // {
      //   nameProduct: updateValue.nameProduct,
      //   descriptionCourse: updateValue.descriptionCourse,
      //   priceProduct: updateValue.priceProduct,
      //   descriptionLast: updateValue.descriptionLast,
      //   courseImg: updateValue.courseImg,
      //   courseLink: updateValue.courseLink,
      //   type: updateValue.type,
      //   inventory: updateValue.inventory,
      //   CategoryId: categoryId.id,
      // },
      { where: { id: id } }
    );
    console.log("object", updateValue.courseLink);

    //findone อีกรอบ, reload()
    const courseUpdate = await Course.findAll({
      attributes: { exclude: "subjectcourse" },
      include: [{ model: Category, as: "subjectcourse" }],
    });

    // res.status(200).json("success");
    res.status(200).json({ courseUpdate });
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  const { id } = req.params;

  try {
    const Itemedit = await Course.findOne({
      where: { id },
      attributes: { exclude: "subjectcourse" },
      include: [{ model: Category, as: "subjectcourse" }],
    });

    if (!Itemedit) {
      throw new AppError("Not Found id", 400);
    }
    res.status(200).json({ Itemedit });
  } catch (err) {
    next(err);
  }
};
