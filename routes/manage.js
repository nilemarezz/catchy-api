const express = require("express");
const router = express.Router();
const { getAllOrders } = require('../controllers/manage/getAllOrders')
const { patchOrderById } = require('../controllers/manage/patchOrderById')
const { getOrderById } = require('../controllers/manage/getOrderByRowId')
const verifyToken = require('../middlewares/verify')
router
  .route("/")
  .get(verifyToken , getAllOrders)
router
  .route("/:id")
  .get(verifyToken , getOrderById)
  .patch(verifyToken , patchOrderById)

module.exports = router;