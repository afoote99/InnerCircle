"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("ConnectionRequests", "suggester_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: "Users",
        },
        key: "user_id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ConnectionRequests", "suggester_id");
  },
};
