const { User_role_one, User_role_two } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9!#$%&?]{6,20}$/,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      profileImage: DataTypes.STRING,
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM(User_role_one, User_role_two),
        allowNull: false,
        defaultValue: User_role_two,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
  User.associate = (db) => {
    User.hasMany(db.Order, {
      foreignKey: {
        name: "UserId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return User;
};
