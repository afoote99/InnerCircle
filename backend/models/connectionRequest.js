const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const ConnectionRequest = sequelize.define("ConnectionRequest", {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(ConnectionRequest, {
  foreignKey: "sender_id",
  as: "sentRequests",
});
ConnectionRequest.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

User.hasMany(ConnectionRequest, {
  foreignKey: "receiver_id",
  as: "receivedRequests",
});
ConnectionRequest.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver",
});

module.exports = ConnectionRequest;
