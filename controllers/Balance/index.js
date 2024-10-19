const {
  customResponse,
  getCurrentUser,
  sequelize,
  Sequelize,
} = require("../../helpers");

exports.index = async (req, res) => {
  try {
    const currentUser = await getCurrentUser({ req });
    const query = `SELECT get_user_balance::int as balance FROM get_user_balance(:id)`;
    const [data] = await sequelize.query(query, {
      replacements: { id: currentUser.id },
      type: Sequelize.QueryTypes.SELECT,
    });

    return customResponse({
      resStatus: data ? 200 : 201,
      status: data ? 0 : 102,
      message: `Get Balance ${data ? "Berhasil" : "Gagal"}`,
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

exports.balance = async (id) => {
  try {
    const query = `SELECT get_user_balance::int as balance FROM get_user_balance(:id)`;
    const [data] = await sequelize.query(query, {
      replacements: { id },
      type: Sequelize.QueryTypes.SELECT,
    });

    return data?.balance;
  } catch (error) {
    console.log(error);
  }
};
