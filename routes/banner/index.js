var express = require("express");
var router = express.Router();
const bannerController = require("../../controllers/Banner");
const helpers = require("../../helpers");

router.get("/", bannerController.index);

module.exports = router;
