module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      subject: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );
  Category.associate = (db) => {
    Category.hasMany(db.Course, {
      as: "subjectcourse",
      foreignKey: {
        name: "CategoryId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Category;
};
