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
  console.log(`${data.indicator}: ${data.val}`);
  //insert values (carId, val, timestamp)
  // indicators will be: spe, cha, cur, vol\
  if (data.indicator == "spe"){
    database.run(`INSERT INTO speedData VALUES (${data.carId},${data.val},${data.timeStamp}) `); 
  } 
  else if(data.indicator == "cha"){
    database.run(`INSERT INTO chargeData VALUES (${data.carId},${data.val},${data.timeStamp}) `); 
  }
  else if(data.indicator == "cur"){
    database.run(`INSERT INTO currentData VALUES (${data.carId},${data.val},${data.timeStamp}) `); 
  }
  else if (data.indicator == "vol"){
    database.run(`INSERT INTO voltageData VALUES (${data.carId},${data.val},${data.timeStamp}) `); 
  }
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
    console.log("A request for data.")
    const carId = req.body.carId;
    res.write("{ ")    
    //TODO: query database for the data
    database.all(`SELECT * FROM speedData WHERE carId = ${carId} order by timeEnt desc limit 1`, (err, rows) => {
      if(rows.length != 0) {
        res.write(`"speed" : ${rows[0].value}, `);
      }
    });
    database.all(`SELECT * FROM chargeData WHERE carId = ${carId} order by timeEnt desc limit 1`, (err, rows) => {
      if(rows.length != 0) {
        res.write(`"charge" : ${rows[0].value}, `)
      }
    });
    database.all(`SELECT * FROM currentData WHERE carId = ${carId} order by timeEnt desc limit 1`, (err, rows) => {
      if(rows.length != 0) {
        res.write(`"current" : ${rows[0].value}, `)
      }
    });
    database.all(`SELECT * FROM voltageData WHERE carId = ${carId} order by timeEnt desc limit 1`, (err, rows) => {
      if(rows.length != 0) {
        res.write(`"voltage" : ${rows[0].value}, `)
      }
    });
    setTimeout(() => {
      res.write(` "trailing" : 0 } `)
      res.end()
    }, 500);
});

app.post("/getDataForChart", (req, res) => {
  const carId = req.body.carId;
  console.log(req.body.chartType)
  res.write("[")    
  //TODO: query database for the data
  database.all(`SELECT * FROM speedData WHERE carId = ${carId} order by timeEnt desc limit 10`, (err, rows) => {
    if(rows.length != 0) {
      res.write(rows.map(row => row.value).join(","));
    }
  });
  setTimeout(() => {
    res.write("]")  
    res.end()
  }, 1000);
});

app.on('exit', function() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});