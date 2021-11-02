const mysql = require("mysql");

//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//VIEW USERS
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
          //check if a user is removed by checking the url params
          let removedUser = req.query.removed;

          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

//SEARCH FOR USERS
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

//ADD FORM
exports.form = (req, res) => {
  res.render("add-user");
};

// ADD NEW USER
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

// EDIT USER
exports.edit = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "SELECT * FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

// UPDATE USER
exports.update = (req, res) => {
  //since the data is in the form - grab it
  const { first_name, last_name, email, comments } = req.body;
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, comments = ? WHERE id = ?",
      [first_name, last_name, email, comments, req.params.id],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          //once you update the user, grab the newly  updated fields
          //query inside a query

          //connect to db
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log(`connection as ID ${connection.threadId}`);

            //use the connection
            connection.query(
              "SELECT * FROM user WHERE id = ? ",
              [req.params.id],
              (err, rows) => {
                //When done rease it
                connection.release();

                if (!err) {
                  res.render("edit-user", {
                    rows,
                    userAlert: `${first_name} has been updated`,
                  });
                } else {
                  console.log(err);
                }
                console.log("The data from the user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

// DELETE USER - HARD DELETE
/*
exports.delete = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "DELETE FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          //when you delete you want to redirect
          res.redirect("/");
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};
*/

//SOFT DELETE
//set the status to removed
exports.delete = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "UPDATE user set status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          //set query params if user is removed
          let removedUserQuery = encodeURIComponent(
            "User successfully removed"
          );

          //when you delete you want to redirect
          res.redirect("/?removed=" + removedUserQuery); //adding params to url
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};

//VIEW SINGLE USER
exports.viewUser = (req, res) => {
  //connect to db
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connection as ID ${connection.threadId}`);

    //use the connection
    connection.query(
      "SELECT * FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        //When done rease it
        connection.release();

        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from the user table: \n", rows);
      }
    );
  });
};
