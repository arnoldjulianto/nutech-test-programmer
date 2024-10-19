"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
      CREATE TABLE membership (
        id uuid NOT NULL,
        first_name varchar(150) NOT NULL,
        last_name varchar(150) NOT NULL,
        email varchar(255) NOT NULL,
        "password" text NOT NULL,
        access_token text NULL,
        jwt_secret text NULL,
        created_on timestamptz NOT NULL,
        updated_on timestamptz NOT NULL,
        last_login timestamptz NULL,
        profile_image text NULL,
        CONSTRAINT membership_pkey PRIMARY KEY (id)
      );`);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query("DROP TABLE membership;");
  },
};
