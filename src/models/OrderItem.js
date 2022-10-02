module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {},
    {
      underscored: true,
    }
  );
  OrderItem.associate = (db) => {
    OrderItem.belongsTo(db.Order, {
      as: "Itemeachorder",
      foreignKey: {
        name: "OrderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    OrderItem.belongsTo(db.Course, {
      as: "Detailorder",
      foreignKey: {
        name: "CourseId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return OrderItem;
};
