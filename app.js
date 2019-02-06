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

app.use(`/login`, loginRouter);
app.use(`/users`, usersRouter); // For user account creation.
app.use(`/utilitybill`, utilitybillRouter);
app.use(`/permits`, permitsRouter);
app.use(`/tickets`, ticketsRouter);
app.use(`/events`, eventsRouter);
app.use(`/webview`, webviewRouter);


module.exports = app;