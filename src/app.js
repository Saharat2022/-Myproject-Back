// const { sequelize } = require("./models");
// // sequelize.drop();
// sequelize.sync({ alter: true });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const notFound = require("./middlewares.js/notFound");
const error = require("./middlewares.js/error");
const app = express();

//moregan => GET / 404 2.150 ms - 47 = req /res time = show req and res for development
if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}
//cors = ให้รับข้อมูลโดเมนไหนก็ได้มาหลังบ้าน
app.use(cors());
//STRING
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoute);
app.use("/users", userRoute);

app.use(notFound);
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server${port}`));
