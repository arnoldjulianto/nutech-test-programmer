const {
  customResponse,
  generateQueryFindAll,
  sequelize,
  Sequelize,
} = require("../../helpers");

exports.index = async (req, res) => {
  try {
    const query = generateQueryFindAll(
      "banner",
      [],
      ["banner_name", "banner_image", "description"]
    );

    const data = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return customResponse({
      resStatus: data.length > 0 ? 200 : 201,
      status: data.length > 0 ? 0 : 102,
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
