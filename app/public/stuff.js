import $ from 'jquery';

var speed = -1;
var charge = -1;
var current = -1;
var voltage = -1;

console.log(`made some vars ${speed}`)

getData = function(){
  $.ajax({
    type : "GET",
    url : "http://localhost:3000/getSpeed",
      complete: function (response) {
        console.log(response.responseText)
        speed = parseInt(response.responseText)
      }
  })
}

updateText = function(){
  console.log("updating text")
  $("#speed").innerText = "Speed: " + speed;
  $("#charge").innerText = "charge: " + charge;
  $("#current").innerText = "current: " + current;
  $("#voltage").innerText = "voltage: " + voltage;
}

updateText();