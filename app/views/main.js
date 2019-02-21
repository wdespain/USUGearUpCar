import App from "./app.js";

(async () => {
  window.app = new App;

  const incrementFunc = async () => {
    await $.ajax({
      type : "POST",
      url : "http://localhost:3000/increment",
      data : `{"number" : "${window.app.displayNum}"`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      complete: function(res) {
        console.log(`New Number: ${res.responseText}`)
        window.app.displayNum += parseInt(res.responseText);
      }
    })
    window.app.displayNewNumber();
  }

  while (true){
    setTimeout(incrementFunc, 10000);
  }
  
})();