const { Course_type_one, Course_type_two } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      nameProduct: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      descriptionCourse: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      priceProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isDecimal: true,
          notEmpty: true,
        },
      },
      descriptionLast: DataTypes.STRING,
      courseImg: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      courseLink: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM(Course_type_one, Course_type_two),
        allowNull: false,
        defaultValue: Course_type_two,
        validate: {
          notEmpty: true,
        },
      },
      inventory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isDecimal: true,
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );
  Course.associate = (db) => {
    Course.hasMany(db.OrderItem, {
      foreignKey: {
        name: "CourseId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Course.belongsTo(db.Category, {
      as: "subjectcourse",
      foreignKey: {
        name: "CategoryId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Course;
};
