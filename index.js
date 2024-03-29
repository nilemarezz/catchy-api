require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");

const UserRoute = require('./routes/authen')
const SearchRoute = require('./routes/search')
const AdminFormRoute = require('./routes/form-admin')
const UserFormRoute = require('./routes/form-user')
const ManageRoute = require('./routes/manage')


var http = require("http");
const router = require('./routes/authen');

app.use(express.static("public"))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ success: true, user: process.env.CATCHY_USERNAME })
})
app.use("/api/orders", UserRoute);
app.use("/api/user", UserRoute)
app.use("/api/search", SearchRoute)
app.use("/api/form-admin", AdminFormRoute)
app.use("/api/form-user", UserFormRoute)
app.use("/api/manage", ManageRoute)


setInterval(function () {
  http.get("http://catchy-api.herokuapp.com");
}, 300000); // every 5 minutes (300000)

app.listen(process.env.PORT || 5000, process.env.YOUR_HOST || '0.0.0.0', () => {
  console.log('Catchy API run at port ' + process.env.PORT || 5000)
})

// app.listen(5000);