'use strict';
// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('stations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(11)
      },
      name: {
        type: DataTypes.STRING(255)
      },
      address: {
        type: DataTypes.STRING(255)
      },
      city: {
        type: DataTypes.STRING(255)
      },
      operator: {
        type: DataTypes.STRING(255)
      },
      capacity: {
        type: DataTypes.INTEGER(11)
      },
      x_coord: {
        type: DataTypes.DOUBLE
      },
      y_coord: {
        type: DataTypes.DOUBLE
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
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('stations');
  }
};