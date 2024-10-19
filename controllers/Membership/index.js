const { MembershipModel } = require("../../models");
const bcrypt = require("bcrypt");
const {
  formValidate,
  customResponse,
  getCurrentUser,
  generateQueryInsert,
  sequelize,
  generateQueryFindOne,
  getTableColumn,
  generateQueryUpdate,
} = require("../../helpers");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Sequelize } = require("sequelize");

//REGISTRATION
exports.registration = async (req, res) => {
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
    params.password = await bcrypt.hash(params.password, 10);
    const query = generateQueryInsert("membership", params);

    const [results, metadata] = await sequelize.query(query, {
      replacements: params,
      type: Sequelize.QueryTypes.INSERT,
    });
    const data = metadata;

    return customResponse({
      status: data ? 0 : 102,
      resStatus: data ? 200 : 400,
      message: `Registrasi ${data ? "berhasil silahkan login" : "gagal"}`,
      res,
    });
  } catch (error) {
    return customResponse({
      resStatus: 400,
      status: 102,
      message: error && error.message ? error.message : "Terjadi Kesalahan",
      res,
    });
  }
};

exports.registrationValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "Email tidak boleh kosong",
      bail: true,
    },
    isEmail: {
      errorMessage: "Parameter email tidak sesuai format",
    },
    normalizeEmail: true,
    custom: {
      options: async (value, { req }) => {
        await getTableColumn("membership").then(async (attributes) => {
          const query = generateQueryFindOne(
            "membership",
            {
              email: value,
            },
            attributes
          );

          await sequelize
            .query(query, {
              replacements: { email: value },
              type: Sequelize.QueryTypes.SELECT,
            })
            .then(([results]) => {
              if (results) {
                return Promise.reject("Email sudah terdaftar");
              }
            });
        });
      },
      bail: true,
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password tidak boleh kosong",
      bail: true,
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password minimal 8 karakter",
    },
  },
  first_name: {
    notEmpty: {
      errorMessage: "First Name tidak boleh kosong",
      bail: true,
    },
  },
  last_name: {
    notEmpty: {
      errorMessage: "Last Name tidak boleh kosong",
      bail: true,
    },
  },
};
//REGISTRATION

//LOGIN
exports.login = async (req, res) => {
  try {
    const validate = formValidate(req);
    if (validate.length > 0) {
      return customResponse({
        resStatus: 400,
        status: 102,
        message: validate[0],
        res,
      });
    }
    const params = req.body;
    const attributes = await getTableColumn("membership");
    const query = generateQueryFindOne(
      "membership",
      {
        email: params.email,
      },
      attributes
    );

    const [results, metadata] = await sequelize.query(query, {
      replacements: { email: params.email },
      type: Sequelize.QueryTypes.SELECT,
    });

    const user = results;
    if (!user) {
      return customResponse({
        status: 103,
        resStatus: 401,
        message: `Username atau password salah`,
        res,
      });
    }

    const match = await bcrypt.compare(params.password, user.password);
    if (!match) {
      return customResponse({
        status: 103,
        resStatus: 401,
        message: `Username atau password salah`,
        res,
      });
    }

    const jwt_secret = crypto.randomBytes(64).toString("hex");
    const access_token = jwt.sign({ email: user.email }, jwt_secret, {
      expiresIn: "12h",
    });

    const last_login = moment().format();
    params.last_login = last_login;
    params.access_token = access_token;
    params.jwt_secret = jwt_secret;
    params.password = user.password;

    const query_update = generateQueryUpdate("membership", params, {
      id: user.id,
    });

    const [results_update, metadata_update] = await sequelize.query(
      query_update,
      {
        replacements: Object.assign({}, params, {
          id: user.id,
        }),
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    const [data] = await sequelize.query(query, {
      replacements: { email: params.email },
      type: Sequelize.QueryTypes.SELECT,
    });

    return customResponse({
      status: data ? 0 : 102,
      resStatus: data ? 200 : 400,
      message: `Login ${data ? "sukses" : "gagal"}`,
      res,
      data: {
        token: data.access_token,
      },
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

exports.loginValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "Email tidak boleh kosong",
      bail: true,
    },
    isEmail: {
      errorMessage: "Parameter email tidak sesuai format",
    },
    normalizeEmail: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password tidak boleh kosong",
      bail: true,
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password minimal 8 karakter",
    },
  },
};
//LOGIN
