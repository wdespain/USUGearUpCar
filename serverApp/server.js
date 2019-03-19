const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

//internal vars
var speed = 0;
var charge = 0;
var voltage = 0;
var current = 0;

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(bodyParser.json({ limit: "3000mb" }));
app.use(bodyParser.urlencoded({ extended : false }));

//connect to database
const database = new sqlite3.Database('./dataStore.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

database.serialize(() => {
  database.run("CREATE TABLE IF NOT EXISTS cars(carId INT PRIMARY KEY, carName TEXT);");

  database.run("INSERT INTO cars VALUES (1, 'Gear Up Car');", (err) =>{
    if (err) {/*Do nothing because if this error it's because this record 
    already existed and it shouldn't be entered multiple times*/}
  });

  database.run("CREATE TABLE IF NOT EXISTS speedData(carId INT, value INT, timeEnt INT);");

  database.run("CREATE TABLE IF NOT EXISTS chargeData(carId INT, value INT, timeEnt INT);");

  database.run("CREATE TABLE IF NOT EXISTS currentData(carId INT, value INT, timeEnt INT);");

  database.run("CREATE TABLE IF NOT EXISTS voltageData(carId INT, value INT, timeEnt INT);");
  /*uncomment this to test that connection and data is correct
  database.all("SELECT * FROM cars", (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });*/
});

app.use(express.static('public'));
//server functions
app.get("/test", function(req, res){
    res.send("This is a test")
})

app.post("/update", (req, res) => {
  const data = req.body;
  console.log(data)
  //TODO: save data in database
  //data will be in the format: [ carId, indicator, val ]
  // indicators will be: spe, cha, cur, vol
  // you will have to get the time: Date.now()
  
  //leave this
  res.end();
});

app.post("/getCarData", (req, res) =>{
  const carId = req.body.carId;
  database.all(`SELECT * FROM cars WHERE carId = ${carId}`, (err, rows) => {
    res.send(rows[0].carName);
  })
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

app.on('exit', function() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});