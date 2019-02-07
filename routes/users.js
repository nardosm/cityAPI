const express = require(`express`);
const router = express.Router();

const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const rp = require(`request-promise-native`);

//const dbconfig = require(`../config/config`);

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
  let cityWorker = 0;

  if (req.body.cityWorker === true) {
    cityWorker = 1;
  }

  // Make a password hash, then do everything else inside the callback function.
  bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
    // Sending err if an err happened.
    if (err) {
      res.status(500).send(`Error creating PW - `, err);
      return;
    }

    try {

      let connectionSettings = {
        method: `POST`,
        uri: `http://129.213.185.211/t/fn-metro-city/createUser`,
        body: {
          username: userName,
          password: hash,
          isCityStaff: cityWorker
        },
        json: true
      };

      let insertResult = await rp(connectionSettings);

      res.status(200).send(insertResult);

    } catch (err) {
      // Catching any errors, sending 500 if they happen.
      res.status(500).send(err);
      return;
    }

  });
});

module.exports = router;