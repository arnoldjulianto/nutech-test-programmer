var express = require("express");
var router = express.Router();
var { checkSchema } = require("express-validator");
const profileController = require("../../controllers/Profile");
const helpers = require("../../helpers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

router.get("/", helpers.verifyToken, profileController.index);
router.put(
  "/update",
  helpers.verifyToken,
  checkSchema(profileController.profileUpdateValidationSchema),
  profileController.update
);

router.put(
  "/image",
  helpers.verifyToken,
  checkSchema(profileController.updateImageValidationSchema),
  profileController.updateImage
);

module.exports = router;
