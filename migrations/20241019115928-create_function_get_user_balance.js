"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION public.get_user_balance(membership_uuid uuid)
        RETURNS numeric
        LANGUAGE plpgsql
        AS $function$
          DECLARE
              total_top_up NUMERIC;
              total_payment NUMERIC;
              balance NUMERIC;
          BEGIN
            --TOTAL TOP UP
              SELECT COALESCE(SUM(total_amount), 0) INTO total_top_up
              FROM transactions
              WHERE transaction_type = 'TOPUP' and transactions.membership_id = membership_uuid;

            -- TOTAL PAYMENT
              SELECT COALESCE(SUM(total_amount), 0) INTO total_payment
              FROM transactions
              WHERE transaction_type = 'PAYMENT' and transactions.membership_id  = membership_uuid;

            -- BALANCE
              balance := total_top_up - total_payment;

              RETURN balance;
          END;
          $function$;
    `);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS get_user_balance(uuid);`
    );
  },
};
