const express = require(`express`);
const router = express.Router();

const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const mysql = require(`promise-mysql`);

const dbconfig = require(`../config/config`);

/* Create a new user. */
router.post(`/`, (req, res) => {
  // Check to make sure the required fields are in body.
  if (!req.body.userName || !req.body.password) {
    res.status(400).send(`Request must contain both username and password.`);
    return;
  }

  // Put the values into nice variables and normalize the data.
  const userName = req.body.userName.toLowerCase();
  const plainPassword = req.body.password;
  const cityWorker = (req.body.cityWorker === true);

  // Make a password hash, then do everything else inside the callback function.
  bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
    // Sending err if an err happened.
    if (err) {
      res.status(500).send(`Error creating PW - `, err);
      return;
    }

    try {
      // Create the DB connection.
      const conn = await mysql.createConnection(dbconfig.settings);

      // Creating the query string outside the request just in case.
      let checkUserString = `SELECT * FROM users WHERE user_name='${userName}'`;
      // Now querying the DB to see if a user with that name already exists.
      let userResult = await conn.query(checkUserString);

      // If the user already exists, send a 400 and tell them they've been bad.
      if (userResult.length > 0) {
        res.status(400).send(`User already exists.`);
        conn.end();
        return;
      }

      // Creating the insert string outside as well just in case.
      let insertString = `INSERT INTO users (user_name, password, city_staff) VALUES ('${userName}','${hash}', ${cityWorker})`;
      // Now we insert the new user into the DB
      let insertResult = await conn.query(insertString);

      // Close the DB connection...
      conn.end();
      // ...and send a 200 for success.
      res.status(200).send(insertResult);

    } catch (err) {
      // Catching any errors, sending 500 if they happen.
      res.status(500).send(err);
      return;
    }

  });
});

module.exports = router;