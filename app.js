const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

//ROUTE DEFAULT
const membershipRouter = require("./routes/membership");
app.use("/", membershipRouter);

//ROUTE PROFILE
const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

//ROUTE BANNER
const bannerRouter = require("./routes/banner");
app.use("/banner", bannerRouter);

//ROUTE SERVICES
const servicesRouter = require("./routes/services");
app.use("/services", servicesRouter);

//ROUTE BALANCE
const balanceRouter = require("./routes/balance");
app.use("/balance", balanceRouter);

//ROUTE TOP UP
const topUpRouter = require("./routes/top-up");
app.use("/topup", topUpRouter);

//ROUTE TRANSACTION
const transactionRouter = require("./routes/transaction");
app.use("/transaction", transactionRouter);

module.exports = app;
