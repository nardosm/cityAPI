// Here is where we're handing a event-reservation system.

const express = require(`express`);
const router = express.Router();

const mysql = require(`promise-mysql`);

const dbconfig = require(`../config/config`);

/* GET all currently-scheduled events. */
router.get(`/`, async (req, res) => {
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Make the query string.
    const queryString = `SELECT * FROM events`;
    // Initiate the query.
    let results = await conn.query(queryString);
    // Initiate the return object (which, in this case, is an array).
    let returnObj = [];
    results.forEach((result) => {
      returnObj.push(cleanUp(result));
    });
    res.send(returnObj);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

////====================== GOTTA FIX THIS AFTER I WRITE AN EVENT===============
/* GET all currently-scheduled events. */
router.get(`/:start/:end`, async (req, res) => {
  let replyObj = {};
  const startTime = parseInt(req.params.start);
  const endTime = parseInt(req.params.end);
  if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
    replyObj.error = `Date range invalid.`;
    res.status(400).send(replyObj);
    return;
  }

});

router.post(`/`, async (req, res) => {
  let replyObj = {};
  let eventName = req.body.eventName;
  let resource = req.body.resource;
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  if (!eventName || !resource || !startTime || !endTime) {
    replyObj.error = `Date range invalid.`;
    res.status(400).send(replyObj);
    return;
  }
  if (resource !== `park` && resource !== `center`) {
    replyObj.error = `Invalid resource name.`;
    res.status(400).send(replyObj);
    return;
  }
  try {
    // Create the DB connection.
    const conn = await mysql.createConnection(dbconfig.settings);
    // Make the query string.
    const queryString = `SELECT * FROM events`;
    // Initiate the query.
    let events = await conn.query(queryString);
    events = events.map((event) => {
      event = cleanUp(event);
      return event.resource === resource;
    });
    res.send(events);
    conn.end();
  } catch (err) {
    // Catching any errors, sending 500 if they happen.
    res.status(500).send(err);
    return;
  }
});

function cleanUp(dirtyObj) {
  let cleanObj = {};
  cleanObj.eventID = dirtyObj.event_id;
  cleanObj.eventName = dirtyObj.event_name;
  cleanObj.resource = dirtyObj.resource;
  cleanObj.startTime = dirtyObj.start_time;
  cleanObj.endTime = dirtyObj.end_time;
  return cleanObj;
}


module.exports = router;