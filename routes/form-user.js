const express = require("express");
const router = express.Router();
const { getOrderByOrderId } = require('../controllers/form-user/getOrderDetail')
const { patchOrderByOrderId } = require('../controllers/form-user/updateOrder')
router
  .route("/:order_id")
  .get(getOrderByOrderId)
  .patch(patchOrderByOrderId)

module.exports = router;