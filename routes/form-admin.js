const express = require("express");
const router = express.Router();
const { createOrder } = require('../controllers/form-admin/createOrder')
const verifyToken = require('../middlewares/verify')
router
  .route("/")
  .post(verifyToken , createOrder)

module.exports = router;