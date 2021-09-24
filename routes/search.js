const express = require("express");
const router = express.Router();
const {getItems} = require("../controllers/search/getItems")

router
  .route("/:twitter/:tel")
  .get(getItems)

module.exports = router;