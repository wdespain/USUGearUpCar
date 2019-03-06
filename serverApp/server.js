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
  //TODO: save data in database
  if (data[1] == "spe"){
    database.run(`INSERT INTO speedData VALUES (${data[0]},${data[2]},${Date.now()}) `); 
  } 
  else if(data[1] == "cha"){
    database.run(`INSERT INTO chargeData VALUES (${data[0]},${data[2]},${Date.now()}) `); 
  }
  else if(data[1] == "cur"){
    database.run(`INSERT INTO currentData VALUES (${data[0]},${data[2]},${Date.now()}) `); 
  }
  else if (data[1] == "vol"){
    database.run(`INSERT INTO voltageData VALUES (${data[0]},${data[2]},${Date.now()}) `); 
  }
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
    let speed = 0;
    let charge = 0;
    let current = 0;
    let voltage = 0;
    //TODO: query database for the data
    database.all("SELECT * FROM speedData WHERE carId = carId order by timeEnt desc limit 1", (err, rows) => {
      speed = rows[0].value;
    }, () => {
      callback(speed);
    });
    database.all("SELECT * FROM chargeData WHERE carId = carId order by timeEnt desc limit 1", (err, rows) => {
      charge = rows[0].value;
    });
    database.all("SELECT * FROM currentData WHERE carId = carId order by timeEnt desc limit 1", (err, rows) => {
      current = rows[0].value;
    });
    database.all("SELECT * FROM voltageData WHERE carId = carId order by timeEnt desc limit 1", (err, rows) => {
      voltage = rows[0].value;
    });
    console.log(speed);
    console.log(charge);
    console.log(current);
    console.log(voltage);

    // get the entry with the same carId with the latest tEnt
    // hint: get the lastest one by ordering by the tEnt and limiting the select statement to 1
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