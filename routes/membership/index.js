var express = require("express");
var router = express.Router();
var { checkSchema } = require("express-validator");
const membershipController = require("../../controllers/Membership");
const helpers = require("../../helpers");

router.post(
  "/registration",
  checkSchema(membershipController.registrationValidationSchema),
  membershipController.registration
);

router.post(
  "/login",
  checkSchema(membershipController.loginValidationSchema),
  membershipController.login
);

module.exports = router;
