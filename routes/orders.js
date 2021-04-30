const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/verify')
const { getOrderById } = require('../controllers/orders/admin/getOrderByRowId')
const { getOrders } = require('../controllers/orders/admin/getOrders')
const { patchOrderById } = require('../controllers/orders/admin/patchOrderByRowId')
const { postOrder } = require('../controllers/orders/admin/postOrder')
const { getOrderByOrderId } = require('../controllers/orders/users/getOrderByOrderId')
const { patchOrderByOrderId } = require('../controllers/orders/users/patchOrderByOrderId')

router
  .route("/")
  .get(verifyToken, getOrders)
  .post(verifyToken, postOrder)
router
  .route("/:id")
  .get(verifyToken, getOrderById)
  .patch(verifyToken, patchOrderById)
router
  .route("/user/:order_id")
  .get(getOrderByOrderId)
  .patch(patchOrderByOrderId)

module.exports = router;