var express = require("express");
var router = express.Router();
const balanceController = require("../../controllers/Balance");
const helpers = require("../../helpers");

router.get("/", helpers.verifyToken, balanceController.index);

module.exports = router;
