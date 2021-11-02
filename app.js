const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middlewear
// parsing application/x-www-form-urlencorded

app.use(bodyParser.urlencoded({ extended: false }));

//parsing application/json
app.use(bodyParser.json());

//static files
app.use(express.static("public"));

//Templating Engines
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//connect to db
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log(`connection as ID ${connection.threadId}`);
});

//Router
const routes = require("./server/routes/userRoutes");
app.use("/", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
