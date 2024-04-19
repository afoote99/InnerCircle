const { Sequelize } = require("sequelize");
const dbConfig = require("./config.js");

const environment = process.env.NODE_ENV || "development";
const config = dbConfig[environment];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

module.exports = sequelize;
