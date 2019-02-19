package com.example.carapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    String[] things = {"speed: 30", "current: 25", "voltage: 5", "charge: 50",
            "speed: 29", "current: 20", "voltage: 15", "charge: 49",
            "speed: 28", "current: 23", "voltage: 10", "charge: 48"};
    Integer arrayPos = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        TextView speedTextView = findViewById(R.id.speedTextView);
        TextView charge = findViewById(R.id.charge);
        TextView current = findViewById(R.id.current);
        TextView voltage = findViewById(R.id.voltage);
        TextView readInText = findViewById(R.id.readInText);

        speedTextView.setText("0MPH");
        charge.setText("Charge: 0");
        current.setText("Current: 0");
        voltage.setText("Voltage: 0");
        readInText.setText("Nothing read in");
    }


    public void next(View v){
        TextView readInText = findViewById(R.id.readInText);
        if(arrayPos > things.length-1) {
            readInText.setText("Nothing to read in");
        } else {
            String text = things[arrayPos];
            String[] splitText = text.split(" ");
            arrayPos += 1;

            readInText.setText(text);

            if(splitText[0].equals("speed:")){
                TextView speedTextView = findViewById(R.id.speedTextView);

                speedTextView.setText(splitText[1]+ "MPH");
            } else if(splitText[0].equals("current:")){
                TextView current = findViewById(R.id.current);

                current.setText(splitText[1] + "curr");
            } else if(splitText[0].equals("charge:")){
                TextView charge = findViewById(R.id.charge);

                charge.setText(splitText[1] + "%");
            } else if(splitText[0].equals("voltage:")){
                TextView voltage = findViewById(R.id.voltage);

                voltage.setText(splitText[1] + "volt");
            }
        }
    }
}
