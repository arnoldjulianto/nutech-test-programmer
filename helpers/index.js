const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { MembershipModel } = require("../models/");
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const sequelize = new Sequelize(
  process.env.DBName,
  process.env.DBUsername,
  process.env.DBPassword,
  {
    host: "localhost",
    dialect: "postgres", // or 'mysql', 'sqlite', etc.
  }
);

const destinationUpload = __dirname + "../../public";
const publicPath = path.join(__dirname, "../public/");

const verifyToken = async (req, res, next) => {
  const token =
    req.cookies.access_token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (token == null) {
    return customResponse({
      resStatus: 401,
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      res,
    });
  }

  const attributes = await getTableColumn("membership");
  const query = generateQueryFindOne(
    "membership",
    {
      access_token: token,
    },
    attributes
  );
  const [user] = await sequelize.query(query, {
    replacements: { access_token: token },
    type: Sequelize.QueryTypes.SELECT,
  });

  if (!user) {
    return customResponse({
      resStatus: 401,
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      res,
    });
  }

  jwt.verify(user.access_token, user.jwt_secret, async (err, decoded) => {
    if (err) {
      await MembershipModel.update(
        {
          access_token: null,
          jwt_secret: null,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      return customResponse({
        resStatus: 401,
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        res,
      });
    } else return next();
  });
};

const getCurrentUser = async ({ req, attributes }) => {
  const access_token =
    req.cookies.access_token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  const query = generateQueryFindOne(
    "membership",
    {
      access_token,
    },
    attributes
  );
  const [data] = await sequelize.query(query, {
    replacements: { access_token },
    type: Sequelize.QueryTypes.SELECT,
  });

  return data;
};

const formValidate = (req) => {
  const errors = validationResult(req);
  let errorfile = [];
  let errMessageValidation = [];
  if (!errors.isEmpty()) {
    for (i = 0; i < errors.errors.length; i++) {
      if (errors.errors[i].message || errors.errors[i].msg) {
        errMessageValidation.push(
          errors.errors[i].message || errors.errors[i].msg
        );
      }
    }
  }

  return errMessageValidation;
};

const customResponse = ({
  status = 0,
  message,
  data = null,
  resStatus = 200,
  res,
}) => {
  return res.status(resStatus).json({
    status,
    message,
    data,
  });
};

const uploadFileLocalServer = (file, maxSize, allowedType, filePath) => {
  const destinationPath = `${destinationUpload}${filePath}/`;
  if (!file) {
    return {
      success: false,
    };
  }
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.name;
  if (!allowedType.includes(ext.toLocaleLowerCase())) {
    return {
      success: false,
      message: `Format Image tidak sesuai`,
    };
  }
  if (fileSize > maxSize * 1024 * 1024) {
    return {
      success: false,
      message: `Ukuran File Maks. ${maxSize}MB`,
    };
  }
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  let errorFile = {
    error: false,
  };

  fs.writeFile(destinationPath + fileName, file.data, function (error) {
    if (error) {
      errorFile = {
        error: true,
        message: error,
      };
    } else {
      errorFile = {
        error: false,
      };
    }
  });

  if (errorFile.error) {
    return {
      success: false,
      message: errorFile.message,
    };
  }

  return {
    success: true,
    fileURL: `${process.env.BASE_URL}${filePath}/${fileName}`,
  };
};

const deleteFileLocalServer = (filePath, fileName) => {
  const destinationPath = path.join(publicPath, `${filePath}/${fileName}`);

  if (fs.existsSync(destinationPath)) {
    fs.unlink(`${destinationPath}`, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file: " + fileName);
      }
    });
  }
  return true;
};

const generateQueryInsert = (tableName, params) => {
  params.id = uuidv4();
  params.created_on = moment().format();
  params.updated_on = moment().format();
  let query = `INSERT INTO ${tableName} `;
  const column = [];
  const values = [];

  query += " ( ";
  Object.keys(params).map((key) => {
    column.push(key);
  });
  query += column.join(",");
  query += " ) ";
  query += " VALUES ";
  query += " ( ";
  Object.keys(params).map((key) => {
    values.push(":" + key);
  });
  query += values.join(",");
  query += " ) ";

  return query;
};

const generateQueryUpdate = (tableName, params, where) => {
  params.updated_on = moment().format();
  let query = `Update ${tableName} SET `;
  const arrUpdate = [];
  Object.keys(params).map((key) => {
    arrUpdate.push(` ${key} = :${key} `);
  });
  query += arrUpdate.join(",");

  if (Object.keys(where).length > 0) {
    query += `WHERE `;
  }
  const arrWhere = [];
  Object.keys(where).map((key) => {
    arrWhere.push(` ${key} = :${key} `);
  });

  query += arrWhere.join(" AND ");
  return query;
};

const generateQueryFindOne = (tableName, where, attributes) => {
  let query = `Select ${attributes.join(",")} FROM ${tableName} `;
  if (Object.keys(where).length > 0) {
    query += `WHERE `;
  }

  const arrWhere = [];
  Object.keys(where).map((key) => {
    arrWhere.push(` ${key} = :${key}`);
  });

  query += arrWhere.join(" AND ");
  query += " LIMIT 1";

  return query;
};

const getTableColumn = async (tableName) => {
  const query = `
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = '${tableName}'
    AND table_schema = 'public';
  `;
  const [results] = await sequelize.query(query);
  let hasil = [];
  results.map((val) => {
    hasil.push(val.column_name);
  });
  return hasil;
};

module.exports = {
  verifyToken,
  formValidate,
  customResponse,
  getCurrentUser,
  uploadFileLocalServer,
  deleteFileLocalServer,
  destinationUpload,
  publicPath,
  sequelize,
  generateQueryInsert,
  generateQueryFindOne,
  getTableColumn,
  generateQueryUpdate,
};
