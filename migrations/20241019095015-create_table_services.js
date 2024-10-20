"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
      CREATE TABLE services (
        id uuid NOT NULL,
        service_code varchar(255) NOT NULL,
        service_name varchar(255) NOT NULL,
        service_icon text NOT NULL,
        service_tarif NUMERIC(11, 0) NOT NULL,
        description text,
        created_on timestamptz NOT NULL,
        updated_on timestamptz NOT NULL,
        CONSTRAINT services_pkey PRIMARY KEY (id),
        CONSTRAINT services_service_code_key UNIQUE (service_code)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query("DROP TABLE services;");
  },
};
