const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Question = sequelize.define("Question", {
  questionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "question_id",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  postedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "posted_date",
  },
  // isAnonymous: {
  // type: DataTypes.BOOLEAN,
  // allowNull: false,
  //defaultValue: false,
  // field: "is_anonymous",
  //},
  scope: {
    type: DataTypes.ENUM("primary", "all"),
    allowNull: false,
    defaultValue: "all",
  },
});

User.hasMany(Question, {
  foreignKey: "user_id",
  as: "questions",
});
Question.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = Question;
