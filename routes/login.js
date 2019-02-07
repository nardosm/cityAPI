// Here is where we're handing the user authentication.

const express = require(`express`);
const router = express.Router();

const bcrypt = require(`bcrypt`);

const rp = require(`request-promise-native`);

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
    // Declare the replyObj that will be used later. Putting it here for easiest scoping.
    let replyObj;

    // Create the connection settings for call to FN.
    let connectionSettings = {
      method: `POST`,
      uri: `http://129.213.185.211/t/fn-metro-city/login`,
      body: {
        username: userName
      },
      json: true
    };

    // Make the call to FN to get user data.
    let userResult = await rp(connectionSettings);

    if (userResult.message !== `Success`) {
      replyObj = {
        error: `Incorrect username/password combination.`
      };
      res.setHeader(`Content-Type`, `application/json`);
      res.status(401).send(replyObj);
      return;
    }

    userResult = JSON.parse(userResult.data);

    // Comparing user password to submitted password.
    bcrypt.compare(password, userResult.PASSWORD, (err, pass) => {
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
      if (userResult.CITY_STAFF) {
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