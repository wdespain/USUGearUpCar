// Library dependencies
const express = require("express");
const router = express.Router();
const path = require("path");
//const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Routes
const index = router.get("/", (req, res, next) => {
	res.render("index");
  //res.send("Hello World.")
	next();
});

// Root middlewares
const notFoundHandler = function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}
const errorHandler = function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}

// Instantiate application
var app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

app.use(logger("dev"));
//app.use(bodyParser.json({ limit: "3000mb" }));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up routes
app.use("/", (req, res, next) => {
  res.render("index");
  //res.send("Hello World.")
  next();
});

// Set up janitor middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
