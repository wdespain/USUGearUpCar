const carId = 1;
//const urlPath = "http://localhost:3000";
const urlPath = "http://10.42.0.1:3000";

getData = function(){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getData`,
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
  $("#speedNum").text(newData.speed)
  $("#chargeNum").text(newData.charge);
  $("#currentNum").text(newData.current);
  $("#voltageNum").text(newData.voltage);
}

instantiateText = function(){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getCarData`,
    data : `{ "carId" : ${carId} }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      $("#carInfo").text(`Info for car: ${response.responseText}`);
    }
  })
  $("#speedNum").text("0")
  $("#chargeNum").text("0");
  $("#currentNum").text("0");
  $("#voltageNum").text("0");
}

instantiateText();

setInterval(function() {
  getData();
}, 5000);