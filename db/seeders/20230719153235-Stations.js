'use strict';

const moment = require('moment')

const now = moment().format('YYYY-MM-DD 00:00:00')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('stations', [
      {
        name: 'Testing name 1',
        address: 'Testing address 1',
        city: 'Testing city 1',
        operator: 'Testing operator 1',
        capacity: 10,
        x_coord: 24.1234567890123,
        y_coord: 60.1234567890123,
        created_at: now,
        modified_at: now
      },
      {
        name: 'Testing name 2',
        address: 'Testing address 2',
        city: 'Testing city 2',
        operator: 'Testing operator 2',
        capacity: 20,
        x_coord: 24.2345678901234,
        y_coord: 60.2345678901234,
        created_at: now,
        modified_at: now
      },
      {
        name: 'Testing name 3',
        address: 'Testing address 3',
        city: 'Testing city 3',
        operator: 'Testing operator 3',
        capacity: 30,
        x_coord: 24.3456789012345,
        y_coord: 60.3456789012345,
        created_at: now,
        modified_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('stations', null, {});
  }
};
