const carId = 1;

getData = function(){
  $.ajax({
    type : "POST",
    url : "http://localhost:3000/getData",
    data : `{ "carId" : ${carId} }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      console.log(response.responseText)
      updateText(JSON.parse(response.responseText));
    }
  })
}

updateText = function(newData){
  $("#speed").text("Speed: " + newData.speed)
  $("#charge").text("charge: " + newData.charge);
  $("#current").text("current: " + newData.current);
  $("#voltage").text("voltage: " + newData.voltage);
}

instantiateText = function(){
  $.ajax({
    type : "POST",
    url : "http://localhost:3000/getCarData",
    data : `{ "carId" : ${carId} }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      $("#carInfo").text(`Info for car: ${response.responseText}`);
    }
  })
  $("#speed").text("Speed: 0")
  $("#charge").text("charge: 0");
  $("#current").text("current: 0");
  $("#voltage").text("voltage: 0");
}

instantiateText();

setInterval(function() {
  getData();
}, 5000);