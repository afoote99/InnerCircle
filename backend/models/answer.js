const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Question = require("./question");

const Answer = sequelize.define("Answer", {
  answerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "answer_id",
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  postedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "posted_date",
  },
});

User.hasMany(Answer, {
  foreignKey: "user_id",
  as: "answers",
});
Answer.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Question.hasMany(Answer, {
  foreignKey: "question_id",
  as: "answers",
});
Answer.belongsTo(Question, {
  foreignKey: "question_id",
  as: "question",
});

module.exports = Answer;
