const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Answer = require("./answer");

const UserInteraction = sequelize.define("UserInteraction", {
  interactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "interaction_id",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(UserInteraction, {
  foreignKey: "user_id",
  as: "interactions",
});
UserInteraction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Answer.hasMany(UserInteraction, {
  foreignKey: "answer_id",
  as: "interactions",
});
UserInteraction.belongsTo(Answer, {
  foreignKey: "answer_id",
  as: "answer",
});

module.exports = UserInteraction;
