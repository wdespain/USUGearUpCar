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
    int randomNum = random(1, 5);
    String output = "";
    if(randomNum == 1){
      output = "qspeed: "+String(random(20, 30))+"q";
    } else if (randomNum == 2){
      output = "qcurrent: "+String(random(10, 40))+"q";
    } else if (randomNum == 3){
      output  = "qvoltage: "+String(random(15, 45))+"q";
    } else if (randomNum == 4){
      output = "qcharge: "+String(random(50, 75))+"q";
    }
    Serial.print(output);
  } 
}
