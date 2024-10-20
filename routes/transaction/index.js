var express = require("express");
var router = express.Router();
const transactionController = require("../../controllers/Transaction");
const helpers = require("../../helpers");
const { checkSchema } = require("express-validator");

router.get("/history", helpers.verifyToken, transactionController.history);
router.post(
  "/",
  helpers.verifyToken,
  checkSchema(transactionController.transactionValidationSchema),
  transactionController.store
);

module.exports = router;
