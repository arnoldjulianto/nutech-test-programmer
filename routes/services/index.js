var express = require("express");
var router = express.Router();
const servicesController = require("../../controllers/Services");
const helpers = require("../../helpers");

router.get("/", helpers.verifyToken, servicesController.index);

module.exports = router;
