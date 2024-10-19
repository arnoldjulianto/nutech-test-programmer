"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
    return queryInterface.createTable("banner", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      banner_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banner_image: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    });*/
    return queryInterface.sequelize.query(`
      CREATE TABLE banner (
        id uuid NOT NULL,
        banner_name varchar(255) NOT NULL,
        banner_image text NOT NULL,
        description text NOT NULL,
        created_on timestamptz NOT NULL,
        updated_on timestamptz NOT NULL,
        CONSTRAINT banner_pkey PRIMARY KEY (id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("banner");
  },
};
