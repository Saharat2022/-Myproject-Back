const { Order_status_one, Order_status_two } = require("../config/constants");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      codePurchase: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      slipPayment: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(Order_status_one, Order_status_two),
        allowNull: false,
        defaultValue: Order_status_one,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );
  Order.associate = (db) => {
    Order.belongsTo(db.User, {
      foreignKey: {
        name: "UserId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Order.hasMany(db.OrderItem, {
      as: "Itemeachorder",
      foreignKey: {
        name: "OrderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Order;
};
