const {
  customResponse,
  getCurrentUser,
  sequelize,
  Sequelize,
  formValidate,
  generateQueryInsert,
} = require("../../helpers");
const balanceController = require("../../controllers/Balance");

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
    const currentUser = await getCurrentUser({ req });
    const params = req.body;
    params.transaction_type = "TOPUP";
    params.membership_id = currentUser.id;
    params.description = "Top Up balance";
    params.total_amount = params.top_up_amount;
    delete params.top_up_amount;

    const query = generateQueryInsert("transactions", params);

    const [results, metadata] = await sequelize.query(query, {
      replacements: params,
      type: Sequelize.QueryTypes.INSERT,
    });

    let data = { balance: 0 };
    if (metadata) {
      data.balance = await balanceController.balance(currentUser.id);
    }
    return customResponse({
      resStatus: data ? 200 : 400,
      message: `Top Up Balance ${data ? "berhasil" : "gagal"}`,
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

exports.topUpValidationSchema = {
  top_up_amount: {
    notEmpty: {
      errorMessage: "Parameter amount tidak boleh kosong",
      bail: true,
    },
    isNumeric: {
      errorMessage:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    },
    isFloat: {
      options: { min: 0 },
      errorMessage:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    },
    toFloat: true,
  },
};
