// Here is where we're handing the utility billing.

const express = require(`express`);
const router = express.Router();

const mysql = require(`promise-mysql`);

const dbconfig = require(`../config/config`);


/* GET the most current utility bill. */
router.get(`/`, async (req, res) => {
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Getting the query string created here.
    const queryString = `SELECT * FROM utility`;
    // Getting the data from DB.
    let result = await conn.query(queryString);
    // Sort our results to get the most recent bill.
    result.sort((a, b) => {
      return b.end_date - a.end_date;
    });
    // Getting the result put into a properly-formatted object.
    let replyObj = cleanUp(result[0]);
    // Send the reply and close the DB connection.
    res.status(200).send(replyObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});


/* Get a specific utility bill (by bill ID). */
router.get(`/:id`, async (req, res) => {
  let replyObj = {};
  let billID = parseInt(req.params.id);
  if (isNaN(billID)) {
    replyObj.error = `No bills found with that ID for this user.`;
    res.status(404).send(replyObj);
    return;
  }
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Getting the query string created here.
    const queryString = `SELECT * FROM utility WHERE bill_id=${billID}`;
    // Getting the data from DB.
    let result = await conn.query(queryString);
    if (result.length < 1) {
      replyObj.error = `No bills found with that ID for this user.`;
      res.status(404).send(replyObj);
      conn.end();
      return;
    }
    // Getting the result put into a properly-formatted object.
    replyObj = cleanUp(result[0]);
    // Send the reply and close the DB connection.
    res.status(200).send(replyObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

/* GET the most current utility bill. */
router.put(`/`, async (req, res) => {
  let replyObj = {};
  let billID = parseInt(req.body.billID);
  if (isNaN(req.body.billID) || typeof req.body.payment !== `boolean`) {
    replyObj.error = `Please provide a bill ID number and payment confirmation.`;
    res.status(400).send(replyObj);
    return;
  }
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Getting the query string created here.
    let queryString = `SELECT * FROM utility WHERE bill_id=${billID}`;
    // Getting the data from DB.
    let result = await conn.query(queryString);
    if (result.length < 1) {
      replyObj.error = `No bills found with that ID for this user.`;
      res.status(404).send(replyObj);
      conn.end();
      return;
    }
    if (req.body.payment) {
      queryString = `UPDATE utility SET total_paid = ${result[0].total_due} WHERE bill_id = ${billID}`;
    } else {
      queryString = `UPDATE utility SET total_paid = 0 WHERE bill_id = ${billID}`;
    }
    result = await conn.query(queryString);
    res.sendStatus(200);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});



function cleanUp(resultObj) {
  let cleanObj = {};
  cleanObj.billID = resultObj.bill_id;
  cleanObj.startDate = resultObj.start_date;
  cleanObj.endDate = resultObj.end_date;
  cleanObj.dueDate = resultObj.due_date;
  cleanObj.pastDue = resultObj.pastDue || 0;
  cleanObj.currentDue = resultObj.current_due;
  cleanObj.totalDue = resultObj.total_due;
  cleanObj.totalPaid = resultObj.total_paid || 0;
  return cleanObj;
}


module.exports = router;