require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");


const OrderRoute = require('./routes/orders')
const UserRoute = require('./routes/users')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ success: true })
})
app.use("/api/orders", OrderRoute);
app.use("/api/user", UserRoute)

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
  console.log('Catchy API run at port ' + PORT)
})