var speed = -1;
var charge = -1;
var current = -1;
var voltage = -1;

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
  $("#speed").text("Speed: " + speed)
  $("#charge").text("charge: " + charge);
  $("#current").text("current: " + current);
  $("#voltage").text("voltage: " + voltage);
}

updateText();