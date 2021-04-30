const express = require("express");
const router = express.Router();
const { postLogin } = require('../controllers/users')

router
  .route("/")
  .post(postLogin)

module.exports = router;