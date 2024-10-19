const {
  customResponse,
  generateQueryFindAll,
  sequelize,
  Sequelize,
} = require("../../helpers");

exports.index = async (req, res) => {
  try {
    const query = generateQueryFindAll(
      "services",
      [],
      ["service_code", "service_name", "service_icon", "service_tarif"]
    );

    const data = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return customResponse({
      resStatus: data.length > 0 ? 200 : 201,
      status: data.length > 0 ? 0 : 108,
      message: data.length > 0 ? "Sukses" : "Gagal",
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
