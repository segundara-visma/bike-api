'use strict';

const moment = require('moment')
// Create moment instances with varying dates.
const now = moment().format('YYYY-MM-DD 00:00:00')
const departure1 = moment().subtract(3, 'month').subtract(10, 'h').subtract(50, 'm').format('YYYY-MM-DD hh:mm:00')
const departure2 = moment().subtract(3, 'month').subtract(10, 'h').subtract(40, 'm').format('YYYY-MM-DD hh:mm:00')
const departure3 = moment().subtract(3, 'month').subtract(10, 'h').subtract(30, 'm').format('YYYY-MM-DD hh:mm:00')
const departure4 = moment().subtract(3, 'month').subtract(10, 'h').subtract(20, 'm').format('YYYY-MM-DD hh:mm:00')

const return1 = moment().subtract(3, 'month').subtract(10, 'h').subtract(30, 'm').format('YYYY-MM-DD hh:mm:00')
const return2 = moment().subtract(3, 'month').subtract(10, 'h').subtract(30, 'm').format('YYYY-MM-DD hh:mm:00')
const return3 = moment().subtract(3, 'month').subtract(10, 'h').subtract(15, 'm').format('YYYY-MM-DD hh:mm:00')
const return4 = moment().subtract(3, 'month').subtract(10, 'h').subtract(15, 'm').format('YYYY-MM-DD hh:mm:00')

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
    await queryInterface.bulkInsert('trips', [
      {
        departure: departure1,
        return: return1,
        departure_station_id: 1,
        departure_station_name: 'Testing name 1',
        return_station_id: 2,
        return_station_name: 'Testing name 2',
        covered_distance: 25,
        duration: 1200,
        created_at: now,
        modified_at: now
      },
      {
        departure: departure2,
        return: return2,
        departure_station_id: 1,
        departure_station_name: 'Testing name 1',
        return_station_id: 3,
        return_station_name: 'Testing name 3',
        covered_distance: 15,
        duration: 600,
        created_at: now,
        modified_at: now
      },
      {
        departure: departure3,
        return: return3,
        departure_station_id: 2,
        departure_station_name: 'Testing name 2',
        return_station_id: 1,
        return_station_name: 'Testing name 1',
        covered_distance: 25,
        duration: 900,
        created_at: now,
        modified_at: now
      },
      {
        departure: departure4,
        return: return4,
        departure_station_id: 2,
        departure_station_name: 'Testing name 2',
        return_station_id: 3,
        return_station_name: 'Testing name 3',
        covered_distance: 15,
        duration: 300,
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
     await queryInterface.bulkDelete('trips', null, {});
  }
};
