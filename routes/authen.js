const express = require("express");
const router = express.Router();
const { postLogin } = require('../controllers/authen/login')

router
  .route("/")
  .post(postLogin)

module.exports = router;