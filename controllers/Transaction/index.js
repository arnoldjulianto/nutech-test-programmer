const {
  customResponse,
  getCurrentUser,
  sequelize,
  Sequelize,
  formValidate,
  generateQueryInsert,
  generateQueryFindOne,
  generateInvoiceNumber,
} = require("../../helpers");
const balanceController = require("../../controllers/Balance");
const moment = require("moment");

exports.store = async (req, res) => {
  try {
    const validate = formValidate(req);

    if (validate.length > 0) {
      return customResponse({
        status: 102,
        resStatus: 400,
        message: validate[0],
        res,
      });
    }
    const params = req.body;
    const service_code = params.service_code;
    const queryService = generateQueryFindOne(
      "services",
      {
        service_code,
      },
      ["*"]
    );

    const [service] = await sequelize.query(queryService, {
      replacements: { service_code },
      type: Sequelize.QueryTypes.SELECT,
    });

    const currentUser = await getCurrentUser({ req });
    const balance = await balanceController.balance(currentUser.id);
    if (balance < service.service_tarif) {
      return customResponse({
        resStatus: 400,
        message: `Saldo tidak mencukupi untuk melakukan transaksi`,
        status: 102,
        res,
      });
    }
    params.transaction_type = "PAYMENT";
    params.membership_id = currentUser.id;
    params.description = service.service_name;
    params.total_amount = service.service_tarif;
    params.ref_id = service.id;
    params.invoice_number = await generateInvoiceNumber(req);
    delete params.service_code;

    const query = generateQueryInsert("transactions", params);

    const [results, metadata] = await sequelize.query(query, {
      replacements: params,
      type: Sequelize.QueryTypes.INSERT,
    });

    let data;
    if (metadata) {
      const _query = generateQueryFindOne(
        "transactions",
        {
          invoice_number: params.invoice_number,
        },
        [
          "invoice_number",
          "service_code",
          "service_name",
          "transaction_type",
          "total_amount",
          "transactions.created_on as created_on",
        ],
        [
          {
            tableName: "services",
            condition: "services.id = transactions.ref_id",
          },
        ]
      );

      data = await sequelize.query(_query, {
        replacements: { invoice_number: params.invoice_number },
        type: Sequelize.QueryTypes.SELECT,
      });
      if (data) {
        data = data[0];
      }
    }
    return customResponse({
      resStatus: data ? 200 : 400,
      message: `Transaksi ${data ? "berhasil" : "gagal"}`,
      status: data ? 0 : 102,
      data,
      res,
    });
  } catch (error) {
    console.log(error);
    return customResponse({
      resStatus: 400,
      status: 102,
      message: error && error.message ? error.message : "Terjadi Kesalahan",
      res,
    });
  }
};

exports.transactionValidationSchema = {
  service_code: {
    notEmpty: {
      errorMessage: "Parameter amount tidak boleh kosong",
      bail: true,
    },
    custom: {
      options: async (value, { req }) => {
        const query = generateQueryFindOne(
          "services",
          {
            service_code: value,
          },
          ["*"]
        );

        await sequelize
          .query(query, {
            replacements: { service_code: value },
            type: Sequelize.QueryTypes.SELECT,
          })
          .then(([results]) => {
            if (!results) {
              return Promise.reject("Service atau Layanan tidak ditemukan");
            }
          });
      },
      bail: true,
    },
  },
};
