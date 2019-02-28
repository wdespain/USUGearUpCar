const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

//internal vars
var speed = 0;
var charge = 0;
var voltage = 0;
var current = 0;

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

app.use(bodyParser.json({ limit: "3000mb" }));
app.use(bodyParser.urlencoded({ extended : false }));

//connect to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass",
  database: "carInfo"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
  /*ONLY RUN THIS IF THE DB HAS NOT BEEN SET UP**********************
  con.query("CREATE DATABASE carInfo", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("CREATE TABLE cars (carName varChar(255), carId int )", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("CREATE TABLE speedData (carId int, speed int, tEnt BIGINT )", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("CREATE TABLE chargeData (carId int, charge int, tEnt BIGINT )", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("CREATE TABLE currentData (carId int, current int, tEnt BIGINT )", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("CREATE TABLE voltageData (carId int, voltage int, tEnt BIGINT )", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
  con.query("INSERT INTO cars VALUES ('Gear Up Car', '1' )", function (err, result) {
    if (err) throw err;
    console.log("car created");
  });
   con.query("SELECT * FROM cars", function (err, result) {
    if (err) throw err;
    //result will be a list that you can itterate through
    result.forEach(r => console.log(`${r.carName} (id: ${r.carId})`)) //Watch out for the d in 'carId' - it's not uppercase!
  });*/
  /*
  con.query(`DROP TABLE speedData`, function (err, result) {
    if (err) throw err;
    console.log("Table Dropped")
  });
  con.query(`DROP TABLE voltageData`, function (err, result) {
    if (err) throw err;
    console.log("Table Dropped")
  });
  con.query(`DROP TABLE chargeData`, function (err, result) {
    if (err) throw err;
    console.log("Table Dropped")
  });
  con.query(`DROP TABLE currentData`, function (err, result) {
    if (err) throw err;
    console.log("Table Dropped")
  });*/
});

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));
//server functions
app.get("/test", function(req, res){
    res.send("This is a test")
})

app.post("/update", (req, res) => {
  const data = req.body;
  //TODO: save data in database
  //data will be in the format: [ carId, indicator, val ]
  // indicators will be: spe, cha, cur, vol
  // you will have to get the time: Date.now()
  
  //leave this
  res.end();
});

app.post("/getCarData", (req, res) =>{
  const carId = req.body.carId;
  con.query(`SELECT * FROM cars WHERE carId = ${carId}`, function (err, result) {
    if (err) throw err;
    //This should have only one result
    res.send(result[0].carName);
  });
});

app.post("/getData", (req, res) => {
    //this will always send a carId
    const carId = req.body.carId;
    //TODO: query database for the data
    // get the entry with the same carId with the latest tEnt
    // hint: get the lastest one by ordering by the tEnt and limiting the select statement to 1
    const speed = Math.floor(Math.random() * 50) + 1;
    const charge = Math.floor(Math.random() * 50) + 1;
    const current = Math.floor(Math.random() * 50) + 1;
    const voltage = Math.floor(Math.random() * 50) + 1;
    //This send doesn't need to change
    res.send(`{ "speed" : ${speed}, "charge" : ${charge}, "current" : ${current}, "voltage" : ${voltage} }`);
});

app.use("/clearTables", (req, res) => {
  con.query(`TRUNCATE TABLE speedData`, function (err, result) {
    if (err) throw err;
    console.log("Table Cleared");
  });
  con.query(`TRUNCATE TABLE voltageData`, function (err, result) {
    if (err) throw err;
    console.log("Table Cleared");
  });
  con.query(`TRUNCATE TABLE chargeData`, function (err, result) {
    if (err) throw err;
    console.log("Table Cleared");
  });
  con.query(`TRUNCATE TABLE currentData`, function (err, result) {
    if (err) throw err;
    console.log("Table Cleared");
  });
  res.end();
});