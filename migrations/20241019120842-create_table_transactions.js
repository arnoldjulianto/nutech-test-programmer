"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
      CREATE TABLE transactions (
        id uuid NOT NULL,
        invoice_number varchar(255),
        transaction_type varchar(50) NOT NULL,
        description text,
        total_amount NUMERIC(11) NOT NULL,
        membership_id uuid NOT NULL,
        ref_id uuid,
        created_on timestamptz NOT NULL,
        updated_on timestamptz NOT NULL,
        CONSTRAINT transactions_pkey PRIMARY KEY (id),
        CONSTRAINT transactions_invoice_number_key UNIQUE (invoice_number),
        FOREIGN KEY (membership_id) REFERENCES membership (id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query("DROP TABLE transactions;");
  },
};
