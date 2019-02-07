const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const logger = require(`morgan`);

const loginRouter = require(`./routes/login`);
const usersRouter = require(`./routes/users`);
const utilitybillRouter = require(`./routes/utilitybill`);
const permitsRouter = require(`./routes/permits`);
const ticketsRouter = require(`./routes/tickets`);
const eventsRouter = require(`./routes/events`);
const webviewRouter = require(`./routes/webview`);

const app = express();

app.disable(`x-powered-by`);

app.use(logger(`dev`));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `public`)));

//
// Set headers to allow CORS requests.
//
app.use((req, res, next) => {
  res.setHeader(`Access-Control-Allow-Origin`, `*`);
  res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS, PUT, DELETE`);
  res.setHeader(`Access-Control-Allow-Headers`, `X-Requested-With,Authorization,X-PINGOTHER, Content-Type`);
  // Check if this is a preflight request. If so, send 200. Otherwise, pass it forward.
  if (req.method === `OPTIONS`) {
    //respond with 200
    res.sendStatus(200);
  } else {
    next();
  }
});


app.use(`/login`, loginRouter);
app.use(`/users`, usersRouter); // For user account creation.
app.use(`/utilitybill`, utilitybillRouter);
app.use(`/permits`, permitsRouter);
app.use(`/tickets`, ticketsRouter);
app.use(`/events`, eventsRouter);
app.use(`/webview`, webviewRouter);


module.exports = app;