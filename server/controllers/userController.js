const mysql = require("mysql");

//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//view users
exports.view = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "SELECT * FROM user WHERE status = 'active' ",
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

//Search for users
exports.find = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    let searchTerm = req.body.search;

    //use the connection
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

//Add form
exports.form = (req, res) => {
  res.render("add-user");
};

// Add  new user
exports.create = (req, res) => {
  const { first_name, last_name, email, comments } = req.body;
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //let searchTerm = req.body.search;

    //use the connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, comments = ?",
      [first_name, last_name, email, comments],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          res.render("add-user");
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });

  res.render("add-user", { alert: "User added successfully" });
};
