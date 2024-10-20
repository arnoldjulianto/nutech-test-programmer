var express = require("express");
var router = express.Router();
const topUpController = require("../../controllers/TopUp");
const helpers = require("../../helpers");
const { checkSchema } = require("express-validator");

router.post(
  "/",
  helpers.verifyToken,
  checkSchema(topUpController.topUpValidationSchema),
  topUpController.store
);

module.exports = router;
