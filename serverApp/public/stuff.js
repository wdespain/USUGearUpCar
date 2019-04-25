//import {Chart} from "chart.js";

const carId = 1;
const latestChargeArraySize = 1200;
const latestSpeedArraySize = 600;
//const urlPath = "http://localhost:3000";
const urlPath = "http://ec2-54-187-254-25.us-west-2.compute.amazonaws.com:3000";
let speedChart = null;
//let secretCharge = 100;
//let secretChargeUpCountDown = 0;
//let secretChargeArray = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
const green = "rgba(0, 153, 0, 0.6)";
const orange = "rgba(255, 153, 0, 0.6)";
const red = "rgba(255, 0, 0, 0.6)";
let orangeTrip = false;
let redTrip = false;
let activeGraph = "latestCharge";
const batteryCapacity = 3110400; //full charge in watt seconds
let focusedCharge = false;

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
  if(newData.chargeGained < 0){
    $("#chargeUpNumber").text(0);
    $("#chargeUpPercent").text(0);
  } else {
    $("#chargeUpNumber").text(newData.chargeGained);
    $("#chargeUpPercent").text(((newData.chargeGained/batteryCapacity) * 100).toFixed(2));
  }
}

getChartData = function(chartType){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getDataForChart`,
    data : `{ "carId" : ${carId}, "chartType" : "${activeGraph}" }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      //console.log(response.responseText);
      const resData = JSON.parse(response.responseText);
      //console.log(activeGraph);
      //console.log(resData.chargeData)
      if(activeGraph == "latestCharge"){
        updateChargeChart(resData.chargeData, resData.percent);
      } else if(activeGraph == "latestSpeed"){
        //console.log(resData.chargeData)
        updateSpeedChart(resData.chargeData);
      }
    }
  })
}

updateChargeChart = function(data, percent){
  var ctx = document.getElementById('myChart').getContext('2d');
  /*
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
  //while(data.length < 10){
  //  data.push(data[data.length-1]);
  //}
  if(focusedCharge == false){
    console.log("focus"+data[data.length - 1]);
    let minTick = data[data.length - 1] - 200000;
    if(minTick < 0){
      minTick = 0;
    }
    let maxTick = data[data.length - 1] + 250000;
    if(maxTick > batteryCapacity){
      maxTick = batteryCapacity;
    }
    speedChart.options.scales.yAxes[0].ticks = {
        min : minTick,
        max : maxTick,
        callback: function(label, index, labels) {
          return Math.trunc((label / 3110400) * 100)
        }
    };
    focusedCharge = true;
  }
  if(percent >= 50) {
    $("#charge").css("background-color", green);
  } else if(percent < 50 && percent >= 30 ){
    $("#charge").css("background-color", orange);
  } else if( percent < 20) {
    $("#charge").css("background-color", red);
  }
  if(orangeTrip == false && Math.trunc((data[data.length-1] / batteryCapacity) * 100) < 50){
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
  } else if(redTrip == false && Math.trunc((data[data.length-1] / batteryCapacity) * 100) < 20){
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
  } else {
    speedChart.data.datasets[0].data = data;
  }
  speedChart.update();
}

updateSpeedChart = function(data){
  //console.log(data);
  var ctx = document.getElementById('myChart').getContext('2d');
  speedChart.data.datasets[0].data = data.map((value, i) => {
    return { "x" : 0 - i, "y" : value }
  });
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
  setupLatestCharge();
  getChartData();
}

setupAllCharge = function(){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getDataForChart`,
    data : `{ "carId" : ${carId}, "chartType" : "${activeGraph}" }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      const resData = JSON.parse(response.responseText);
      const ctx = document.getElementById('myChart').getContext('2d');
      var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
      gradientFill.addColorStop(1, green);
      const lastChargeDataPercent = Math.trunc((resData.chargeData[resData.chargeData.length - 1] / batteryCapacity) * 100);
      if( lastChargeDataPercent > 50){
        gradientFill.addColorStop(0, green);
      } else if( lastChargeDataPercent > 30 && lastChargeDataPercent < 50){
        gradientFill.addColorStop(0, orange);
      } else {
        gradientFill.addColorStop(0, red);
      }
      speedChart.destroy();
      speedChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels : resData.labels,
          datasets : [{
            data : resData.chargeData,
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
                max: batteryCapacity, // maximum value, which should be the maximum watt seconds for the battery capacity
                callback: function(label, index, labels) {
                  return Math.trunc((label / 3110400) * 100)
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Watt Seconds'
              }
            }],
            xAxes: [{
              ticks: {  
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: 'All Charge Readings'
              }
            }]
          }
        }
      });
    }
  })
}

setupLatestCharge = function(){
  focusedCharge = false;
  const ctx = document.getElementById('myChart').getContext('2d');
  var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
  gradientFill.addColorStop(0, green);
  gradientFill.addColorStop(1, green);
  if(speedChart != null){
    speedChart.destroy();
  }
  //speedChart.destroy();
  speedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels : new Array(latestChargeArraySize).fill(0),
      datasets : [{
        data : new Array(latestChargeArraySize).fill(batteryCapacity),
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
            max: batteryCapacity, // maximum value, which should be the maximum watt seconds for the battery capacity
            callback: function(label, index, labels) {
              return Math.trunc((label / 3110400) * 100)
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Percent Charge'
          }
        }],
        xAxes: [{
          ticks: {
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Last 10 Minutes Charge Readings'
          }
        }]
      }
    }
  });
}

setupLatestSpeed = function(){
  const ctx = document.getElementById('myChart').getContext('2d');
  if(speedChart != null){
    speedChart.destroy();
  }
  speedChart.destroy();
  speedChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      label : "speed",
      datasets : [{
        data : new Array(latestSpeedArraySize).fill(0).map((value, i) => {
          return { "x" : 0 - i, "y" : value }
        }),
        label : "speed",
        fill : "start"
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
            max: 30 // maximum value, which should be the maximum watt seconds for the battery capacity
          },
          scaleLabel: {
            display: true,
            labelString: 'MPH'
          }
        }],
        xAxes: [{
          ticks: {
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Last 10 Minutes Speed Readings'
          }
        }]
      }
    }
  });
}

setupSpeed = function (){
  $.ajax({
    type : "POST",
    url : `${urlPath}/getDataForChart`,
    data : `{ "carId" : ${carId}, "chartType" : "${activeGraph}" }`,
    contentType : "application/json; charset=utf-8",
    dataType : "json",
    complete: function (response) {
      const resData = JSON.parse(response.responseText);
      console.log("allcharge");
      const ctx = document.getElementById('myChart').getContext('2d');
      speedChart.destroy();
      speedChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          labels : "speed",
          datasets : [{
            data : resData.chargeData.map((value, i) => {
              return { "x" : 0 - i, "y" : value }
            }),
            label : "speed",
            fill : "start"
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
                max: 30 // maximum value
              },
              scaleLabel: {
                display: true,
                labelString: 'MPH'
              }
            }],
            xAxes: [{
              ticks: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: 'All Speed Readings'
              }
            }]
          }
        }
      });
    }
  })
}

instantiateText();

$("#allCharge").on("click", () => {
  $("#allCharge").attr("disabled", true);
  activeGraph = "allCharge";
  setupAllCharge();
  $("#latestCharge").attr("disabled", false);
  $("#allSpeed").attr("disabled", false);
  $("#latestSpeed").attr("disabled", false);
});

$("#latestCharge").on("click", () => {
  $("#allCharge").attr("disabled", false);
  $("#latestCharge").attr("disabled", true);
  activeGraph = "latestCharge";
  setupLatestCharge();
  $("#allSpeed").attr("disabled", false);
  $("#latestSpeed").attr("disabled", false);
});

$("#allSpeed").on("click", () => {
  $("#allCharge").attr("disabled", false);
  $("#latestCharge").attr("disabled", false);
  $("#allSpeed").attr("disabled", true);
  activeGraph = "allSpeed";
  setupSpeed();
  $("#latestSpeed").attr("disabled", false);
});
$("#latestSpeed").on("click", () => {
  $("#allCharge").attr("disabled", false);
  $("#latestCharge").attr("disabled", false);
  $("#allSpeed").attr("disabled", false);
  $("#latestSpeed").attr("disabled", true);
  activeGraph = "latestSpeed";
  setupLatestSpeed();
});

setInterval(function() {
  getData();
  if(activeGraph == "latestCharge" || activeGraph == "latestSpeed"){
    getChartData();
  }
}, 1000);