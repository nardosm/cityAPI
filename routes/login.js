// Here is where we're handing the user authentication.

const express = require(`express`);
const router = express.Router();

const bcrypt = require(`bcrypt`);

const mysql = require(`promise-mysql`);

const dbconfig = require(`../config/config`);

/* Route to authenticate user. */
router.post(`/`, async (req, res) => {
  // Check to make sure the required fields are in body.
  if (!req.body.userName || !req.body.password) {
    res.status(400).send(`Request must contain both username and password.`);
    return;
  }

  // Putting values into variables for reader-friendliness.
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);

    // Declare the replyObj that will be used later. Putting it here for easiest scoping.
    let replyObj;

    // Creating the query string outside the request just in case.
    let checkUserString = `SELECT password, city_staff FROM users WHERE user_name='${userName}'`;
    // Querying the DB to see if this user exists, and getting PW hash if they do.
    let userResult = await conn.query(checkUserString);

    // If user is not found, send 401 (not differentiating 401 and 404 for security reasons.)
    if (userResult.length === 0) {
      replyObj = {
        error: `Incorrect username/password combination.`
      };
      res.setHeader(`Content-Type`, `application/json`);
      res.status(401).send(replyObj);
      return;
    }

    // Comparing user password to submitted password.
    bcrypt.compare(password, userResult[0].password, (err, pass) => {
      // Sending err if an err happened.
      if (err) {
        res.status(500).send(`Error authenticating user.\n`, err);
        return;
      }


      // If password doesn't verify, send 401.
      if (!pass) {
        replyObj = {
          error: `Incorrect username/password combination.`
        };
        res.setHeader(`Content-Type`, `application/json`);
        res.status(401).send(replyObj);
        return;
      }

      // Send a different token if user is or isn't on the city staff.
      if (userResult[0].city_staff) {
        replyObj = {
          userToken: `aaaaa`
        };
      } else {
        replyObj = {
          userToken: `bbbbb`
        };
      }

      // Finally, send the login success reply.
      res.setHeader(`Content-Type`, `application/json`);
      replyObj.troubleshooting = req.headers;
      replyObj.troubleshooting2 = req.body;
      res.status(200).send(replyObj);

    });

  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

router.get(`/special/:theValue/:theKey`, (req, res) => {
  console.log(`req.params.value`);
  console.log(decodeURIComponent(req.params.theValue));
  console.log(`req.params.key`);
  console.log(decodeURIComponent(req.params.theKey));
  res.send(`../public/loginpage.html`);
});



module.exports = router;