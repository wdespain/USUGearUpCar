//import {Chart} from "chart.js";

const carId = 1;
const urlPath = "http://localhost:3000";
//const urlPath = "http://ec2-54-187-254-25.us-west-2.compute.amazonaws.com:3000";
let speedChart = null;
//let secretCharge = 100;
//let secretChargeUpCountDown = 0;
//let secretChargeArray = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
const green = "rgba(0, 153, 0, 0.6)";
const orange = "rgba(255, 153, 0, 0.6)";
const red = "rgba(255, 0, 0, 0.6)";
let orangeTrip = false;
let redTrip = false;

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
  $("#speedNum").text(newData.speed)
  $("#chargeNum").text(newData.charge);
  $("#speedHighNum").text(newData.highestSpeed);
  $("#chargeUpNumber").text(newData.chargeGained);
}

getChartData = function(){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getDataForChart`,
    data : `{ "carId" : ${carId} }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      //console.log(response.responseText);
      updateChargeChart(JSON.parse(response.responseText));
    }
  })
}

updateChargeChart = function(data){
  /*var ctx = document.getElementById('myChart').getContext('2d');
  if(Math.floor(Math.random() * (25 + 1)) == 5){
    secretChargeUpCountDown = 10;
  }
  secretChargeUpCountDown -= 1;
  if(secretChargeUpCountDown > 0){
    secretCharge += 1;
  } else {
    secretCharge -= 1;
  }
  secretChargeArray = secretChargeArray.slice(1)
  secretChargeArray.push(secretCharge)
  data = secretChargeArray*/
  while(data.length < 10){
    data.push(data[data.length-1]);
  }
  if(data[data.length-1] <= 50 && orangeTrip == false){
    orangeTrip = true;
    var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
    gradientFill.addColorStop(1, green);
    gradientFill.addColorStop(0, orange);
    speedChart.data.datasets[0] = {
      data : data,
      label : "charge",
      fill : "start",
      backgroundColor: gradientFill
    };
    $("#charge").css("background-color", orange);
  } else if(data[data.length-1] <= 20 && redTrip == false){
    redTrip = true;
    var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
    gradientFill.addColorStop(1, orange);
    gradientFill.addColorStop(0, red);
    speedChart.data.datasets[0] = {
      data : data,
      label : "charge",
      fill : "start",
      backgroundColor: gradientFill
    };
    $("#charge").css("background-color", red);
  } else {
    speedChart.data.datasets[0].data = data;
  }
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
      $("#carInfo").text(response.responseText);
    }
  })
  getData();
  const ctx = document.getElementById('myChart').getContext('2d');
  var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
  gradientFill.addColorStop(0, green);
  gradientFill.addColorStop(1, green);
  speedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels : [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0],
      datasets : [{
        data : [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        label : "charge",
        fill : "start",
        backgroundColor: gradientFill
      }]
    },
    options: {
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          display: true,
          stacked: true,
          ticks: {
            min: 0, // minimum value
            max: 100 // maximum value
          }
        }],
        xAxes: [{
          ticks: {
            display: false //this will remove only the label
          }
        }]
      }
    }
  });
  getChartData();
}

instantiateText();

setInterval(function() {
  getData();
  getChartData();
}, 1000);