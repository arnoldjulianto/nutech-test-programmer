"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
    return queryInterface.createTable("membership", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      access_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      jwt_secret: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_on: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_on: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      last_login: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      profile_image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
    */
    return queryInterface.sequelize.query(`
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
    return await queryInterface.dropTable("membership");
  },
};
