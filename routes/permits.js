// Here is where we're handing the business permit requests.

const express = require(`express`);
const router = express.Router();

const mysql = require(`promise-mysql`);

const dbconfig = require(`../config/config`);


/* GET all permit applications. */
router.get(`/`, async (req, res) => {
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Make the query string.
    const queryString = `SELECT * FROM applications`;
    // Initiate the query.
    let applications = await conn.query(queryString);
    let returnObj = {
      permits: applications
    };
    res.send(returnObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

/* GET a specific permit applications. */
router.get(`/:id`, async (req, res) => {
  let replyObj = {};
  // Get the ID number for the request, and make sure it's an integer.
  let permitReqID = parseInt(req.params.id);
  if (isNaN(permitReqID)) {
    replyObj.error = `No permit application exists with that ID.`;
    res.status(404).send(replyObj);
    return;
  }
  try {
    // Declare the reply object out here for scope.
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Make the query string.
    const queryString = `SELECT * FROM applications WHERE application_id=${permitReqID}`;
    // Initiate the query.
    let applications = await conn.query(queryString);
    // If nothing was found, return 404.
    if (applications.length < 1) {
      replyObj.error = `No permit application exists with that ID.`;
      res.status(404).send(replyObj);
      conn.end();
      return;
    }
    // Otherwise, return with the application data.
    replyObj = applications[0];
    res.send(replyObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

router.post(`/`, async (req, res) => {
  // Declaring replyObj here for scope.
  let replyObj = {};
  if (req.body.type !== `PlumbingPermit` && req.body.type !== `KennelPermit`) {
    replyObj.error = `Permit type invalid.`;
    res.status(400).send(replyObj);
    return;
  }
  try {
    let permitData = JSON.stringify(req.body.permitData);
    // Big check to make sure there are no null values in property.
    const conn = await mysql.createConnection(dbconfig.settings);
    let queryString = `INSERT INTO applications (type, appl_data) VALUES ('${req.body.type}', ${JSON.stringify(permitData)})`;
    let result = await conn.query(queryString);
    let insertedValueQuery = `SELECT last_insert_id()`;
    result = await conn.query(insertedValueQuery);
    replyObj.applicationID = result[0][`last_insert_id()`];
    res.status(200).send(replyObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

router.put(`/:id`, async (req, res) => {
  let replyObj = {};
  const permitID = parseInt(req.params.id);
  if (typeof req.body.approved !== `boolean`) {
    replyObj.error = `Invalid approval type.`;
    res.status(400).send(replyObj);
    return;
  }
  if (isNaN(permitID)) {
    replyObj.error = `No permit application exists with that ID.`;
    res.status(404).send(replyObj);
    return;
  }
  try {
    const conn = await mysql.createConnection(dbconfig.settings);
    let queryString = `SELECT * FROM applications WHERE application_id=${permitID}`;
    let result = await conn.query(queryString);
    if (result.length < 1) {
      replyObj.error = `No permit application exists with that ID.`;
      res.status(404).send(replyObj);
      conn.end();
      return;
    }
    queryString = `UPDATE applications SET accepted = ${req.body.approved} WHERE application_id = ${permitID}`;
    result = await conn.query(queryString);
    res.sendStatus(200);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

module.exports = router;