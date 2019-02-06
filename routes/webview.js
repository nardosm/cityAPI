// Route just for redirecting to the webview page...

const express = require(`express`);
const router = express.Router();

router.post(`/`, (req, res) => {
  let webviewObj = {};
  let returnString0 = encodeURIComponent(req.body.parameters[0].value);
  let returnString1 = encodeURIComponent(req.body.parameters[0].key);
  console.log(`returnString`);
  console.log(returnString0);
  console.log(`returnString1`);
  console.log(returnString1);
  webviewObj[`webview.url`] = `https://scratch-cityapi.herokuapp.com/login/special/${returnString0}/${returnString1}`;

  res.send(webviewObj);
});

module.exports = router;