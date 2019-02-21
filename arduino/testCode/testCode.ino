/*
Whitney DeSpain Testing
*/

void setup() {
  Serial.begin(9600);
}

void loop() {
  randomSeed(millis());
  while(true){
    delay(3000);
    int randomNum = random(1, 4);
    String output = "";
    if(randomNum == 1){
      output = "speed: "+String(random(20, 30));
    } else if (randomNum == 2){
      output = "current: "+String(random(10, 40));
    } else if (randomNum == 3){
      output  = "voltage: "+String(random(15, 45));
    } else if (randomNum == 4){
      output = "charge: "+String(random(50, 75));
    }
    Serial.print(output);
  } 
}
