const express = require("express");

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

app.use(express.static('public'));

app.get("/test", function(req, res){
    res.send("This is a test")
})

app.use("/updateSpeed", (req, res) => {
  speed = req.body.speed;
});
app.use("/getSpeed", (req, res) => {
    res.send(speed);
});