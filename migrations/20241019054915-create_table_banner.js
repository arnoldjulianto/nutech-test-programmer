"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
      CREATE TABLE banner (
        id uuid NOT NULL,
        banner_name varchar(255) NOT NULL,
        banner_image text NOT NULL,
        description text,
        created_on timestamptz NOT NULL,
        updated_on timestamptz NOT NULL,
        CONSTRAINT banner_pkey PRIMARY KEY (id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query("DROP TABLE banner;");
  },
};
