const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Connection = sequelize.define(
  "Connection",
  {
    connection_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connected_since: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    user_id_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    tableName: "Connections",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id_1", "user_id_2"],
      },
    ],
  }
);

// Define the associations
Connection.belongsTo(User, {
  foreignKey: "user_id_1",
  as: "user1",
});
Connection.belongsTo(User, {
  foreignKey: "user_id_2",
  as: "user2",
});

User.hasMany(Connection, {
  foreignKey: "user_id_1",
  as: "connectionsInitiated",
});
User.hasMany(Connection, {
  foreignKey: "user_id_2",
  as: "connectionsReceived",
});

module.exports = Connection;
