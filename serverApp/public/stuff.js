//import {Chart} from "chart.js";

const carId = 1;
const urlPath = "http://localhost:3000";
let speedChart = null;
let secretCharge = 100;
let secretChargeArray = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
const green = "rgba(0, 153, 0, 0.6)";
const orange = "rgba(255, 153, 0, 0.6)";
const red = "rgba(255, 0, 0, 0.6)"

//const urlPath = "http://10.42.0.1:3000";

getData = function(){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getData`,
    data : `{ "carId" : ${carId} }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      //console.log(response.responseText)
      updateText(JSON.parse(response.responseText));
    }
  })
}

updateText = function(newData){
  //$("#speedNum").text(newData.speed)
  $("#speedNum").text(secretCharge)
  $("#chargeNum").text(newData.charge);
  $("#currentNum").text(newData.current);
  $("#voltageNum").text(newData.voltage);
}

getChartData = function(chartType){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getDataForChart`,
    data : `{ "carId" : ${carId}, "chartType" : "${chartType}" }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      //console.log(response.responseText);
      updateSpeedChart(JSON.parse(response.responseText));
    }
  })
}

updateSpeedChart = function(data){
  var ctx = document.getElementById('myChart').getContext('2d');
  secretCharge -= 1;
  secretChargeArray = secretChargeArray.slice(1)
  secretChargeArray.push(secretCharge)
  var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
  for(let i=0; i<secretChargeArray.length; i++){
    if(secretChargeArray[i] >= 50){
      gradientFill.addColorStop(0, green);
    } else if(secretChargeArray[i] < 50 && secretChargeArray[i] >= 30){
      gradientFill.addColorStop(0, orange);
    }else if(secretChargeArray[i] > 30){
      gradientFill.addColorStop(0, red);
    }
  }
  console.log(secretChargeArray)
  //ctx.height = 256;
  //ctx.width = 340;
  //WeatherChart.data.datasets[0].data = [1, 2, 3, 4];
  speedChart.data.datasets[0] = {
    data : secretChargeArray,
    label : "speed",
    fill : "start",
    backgroundColor: gradientFill
  };
  speedChart.update();
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
  getData();
  const ctx = document.getElementById('myChart').getContext('2d');
  speedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels : [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0],
      datasets : [{
        data : secretChargeArray,
        label : "speed",
        fill : "start"
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          display: true,
          stacked: true,
          ticks: {
            min: 0, // minimum value
            max: 100 // maximum value
          }
        }]
      }
    }
  });
  getChartData("speed");
}

instantiateText();

setInterval(function() {
  getData();
  getChartData("speed");
}, 500);