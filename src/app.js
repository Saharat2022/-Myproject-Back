require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFound = require("./notFound.js/notFound");
const error = require("./notFound.js/error");
const app = express();

//moregan => GET / 404 2.150 ms - 47 = req /res time
if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}
//cors = ให้รับข้อมูลโดเมนไหนก็ได้
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//morgan=show req and res for development
app.use(notFound);
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server${port}`));
