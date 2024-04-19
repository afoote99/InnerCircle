const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Profile = sequelize.define("Profile", {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "profile_id",
  },
  firstName: {
    type: DataTypes.STRING,
    field: "first_name",
  },
  lastName: {
    type: DataTypes.STRING,
    field: "last_name",
  },
  bio: {
    type: DataTypes.TEXT,
  },
  profilePicture: {
    type: DataTypes.TEXT,
    field: "profile_picture",
  },
});

User.hasOne(Profile, {
  foreignKey: "user_id",
  as: "profile",
});
Profile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = Profile;
