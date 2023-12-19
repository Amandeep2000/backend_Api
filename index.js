require("dotenv").config();
require("./alias");
const cors = require("cors");
const express = require("express");
const useroute = require("@routes/route");
const AdminRoutes = require("@routes/admin");
const bodyParser = require("body-parser");
const multer = require("multer");
var ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const port = 8000;
const staticpath = path.join(__dirname, "public");
const serverurl = `http://localhost:${port}`;

const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200000,
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(useroute);
app.use(AdminRoutes);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/products", function (req, res) {
  res.json({ msg: "This is CORS-enabled for only example.com." });
});

// app.use(express.static(staticpath));

app.set("view engine", "ejs");

app.use(ejsLayouts);

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      success: 0,
      message: err.message
    });
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`server is running at ${serverurl}`);
});
