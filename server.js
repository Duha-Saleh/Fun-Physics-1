const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

require("dotenv").config();

const app = express();

const { pgPool } = require("./databaseConnection");

app.use(session({
  store: new pgSession({ // eslint-disable-line
    pool: pgPool, // Connection pool
    tableName: "sessions", // Use another table-name than the default "session" one
  }),
  secret: process.env.SESSION_COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// set public
app.use(express.static("public"));

// set ejs
app.set("view engine", "ejs");

app.all("*", (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE",
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// page not found middleware
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Sorry, page not found !" });
});

// error middleware
app.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).render("pages/error", { error: err });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started - ${PORT}`);
});
