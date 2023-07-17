'use strict';
// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(11)
      },
      departure: {
        type: DataTypes.DATE
      },
      return: {
        type: DataTypes.DATE
      },
      departure_station_id: {
        type: DataTypes.INTEGER(11)
      },
      departure_station_name: {
        type: DataTypes.STRING(255)
      },
      return_station_id: {
        type: DataTypes.INTEGER(11)
      },
      return_station_name: {
        type: DataTypes.STRING(255)
      },
      covered_distance: {
        type: DataTypes.INTEGER(11)
      },
      duration: {
        type: DataTypes.INTEGER(11)
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      modified_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('trips');
  }
};