const { MembershipModel } = require("../../models");
const bcrypt = require("bcrypt");
const {
  formValidate,
  customResponse,
  getCurrentUser,
  destinationUpload,
  uploadFileLocalServer,
  deleteFileLocalServer,
  destinationUnlink,
  generateQueryUpdate,
  sequelize,
  Sequelize,
} = require("../../helpers");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.index = async (req, res) => {
  try {
    const data = await getCurrentUser({
      req,
      attributes: ["email", "first_name", "last_name", "profile_image"],
    });

    return customResponse({
      resStatus: data ? 200 : 201,
      status: data ? 0 : 108,
      message: data ? "Sukses" : "Gagal",
      data,
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

exports.update = async (req, res) => {
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
    const currentUser = await getCurrentUser({ req });

    const query_update = generateQueryUpdate("membership", params, {
      id: currentUser.id,
    });

    const [results, data] = await sequelize.query(query_update, {
      replacements: Object.assign({}, params, {
        id: currentUser.id,
      }),
      type: Sequelize.QueryTypes.UPDATE,
    });

    return customResponse({
      resStatus: data ? 200 : 401,
      message: `Update Pofile ${data ? "berhasil" : "gagal"}`,
      status: data ? 0 : 102,
      data: await getCurrentUser({
        req,
        attributes: ["email", "first_name", "last_name", "profile_image"],
      }),
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

exports.profileUpdateValidationSchema = {
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

exports.updateImage = async (req, res) => {
  try {
    const currentUser = await getCurrentUser({ req });
    const file = req.files.file;
    const upload = uploadFileLocalServer(file, 25, [".png", ".jpeg"], "");
    if (file && !upload.success) {
      return customResponse({
        status: 102,
        resStatus: 400,
        res,
        message: upload.message,
      });
    }

    if (currentUser) {
      const pecah = currentUser.profile_image?.split("/");
      const fileName = pecah && pecah.length && pecah[pecah.length - 1];
      if (file && upload.success && fileName) {
        const deleteFile = deleteFileLocalServer("", fileName);
        if (!deleteFile) {
          return res.json({
            success: false,
            message: "Gagal Hapus File Lama",
          });
        }
      }
    }
    const params = {
      profile_image: upload.fileURL,
    };
    const query_update = generateQueryUpdate("membership", params, {
      id: currentUser.id,
    });

    const [results, data] = await sequelize.query(query_update, {
      replacements: Object.assign({}, params, {
        id: currentUser.id,
      }),
      type: Sequelize.QueryTypes.UPDATE,
    });

    return customResponse({
      res,
      status: data ? 0 : 102,
      resStatus: data ? 200 : 400,
      message: `Update Profile Image ${data ? "berhasil" : "gagal"} `,
      data: await getCurrentUser({
        req,
        attributes: ["email", "first_name", "last_name", "profile_image"],
      }),
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

exports.updateImageValidationSchema = {
  file: {
    exists: {
      errorMessage: "Image tidak boleh kosong",
    },
  },
};
