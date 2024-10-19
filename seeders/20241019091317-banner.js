const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
     INSERT INTO banner (id, banner_name, banner_image, description, created_on, updated_on)
      VALUES
        ('${uuidv4()}', 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}'),
        ('${uuidv4()}', 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}'),
        ('${uuidv4()}', 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}'),
        ('${uuidv4()}', 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}'),
        ('${uuidv4()}', 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}'),
        ('${uuidv4()}', 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '${moment().format()}', '${moment().format()}');
      `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("TRUNCATE TABLE banner CASCADE;");
  },
};
