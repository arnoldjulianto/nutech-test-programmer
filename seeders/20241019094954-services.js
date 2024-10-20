"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      INSERT INTO services (id, service_code, service_name, service_icon, service_tarif, created_on, updated_on)
       VALUES
         ('${uuidv4()}', 'PAJAK',  'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'PLN',  'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'PDAM',  'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'PULSA',  'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'PGN',  'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'MUSIK',  'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'TV',  'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'PAKET_DATA',  'Paket Data', 'https://nutech-integrasi.app/dummy.jpg', 50000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'VOUCHER_GAME',  'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'VOUCHER_MAKANAN',  'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'QURBAN',  'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 100000, '${moment().format()}', '${moment().format()}'),
         ('${uuidv4()}', 'ZAKAT',  'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 100000, '${moment().format()}', '${moment().format()}');
       `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("TRUNCATE TABLE services CASCADE;");
  },
};
