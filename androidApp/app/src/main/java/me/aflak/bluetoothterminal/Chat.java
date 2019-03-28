package me.aflak.bluetoothterminal;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
//import android.text.method.ScrollingMovementMethod;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
//import android.widget.Button;
//import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import me.aflak.bluetooth.Bluetooth;

public class Chat extends AppCompatActivity implements Bluetooth.CommunicationCallback {
    private ArrayList<String> speed = new ArrayList<>();
    private ArrayList<String> charge = new ArrayList<>();
    private ArrayList<String> current = new ArrayList<>();
    private ArrayList<String> voltage = new ArrayList<>();
    String url;
    String carId;
    //private String name;
    private Bluetooth b;
    //private EditText message;
    //private Button send;
    private TextView text;
    private TextView speedText;
    private TextView chargeText;
    private TextView currentText;
    private TextView voltageText;
    private ScrollView scrollView;
    private boolean registered=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        speed.add("0");
        charge.add("0");
        current.add("0");
        voltage.add("0");
        carId = "1";
        url = "http://144.39.109.239:3000";

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //text = (TextView)findViewById(R.id.speedTextDesc);
        speedText = (TextView)findViewById(R.id.speedText);
        chargeText = (TextView)findViewById(R.id.chargeText);
        currentText = (TextView)findViewById(R.id.currentText);
        voltageText = (TextView)findViewById(R.id.voltageText);
        //message = (EditText)findViewById(R.id.message);
        //send = (Button)findViewById(R.id.send);
        scrollView = (ScrollView) findViewById(R.id.scrollView);

        //text.setMovementMethod(new ScrollingMovementMethod());
        //send.setEnabled(false);

        b = new Bluetooth(this);
        b.enableBluetooth();

        b.setCommunicationCallback(this);

        int pos = getIntent().getExtras().getInt("pos");
        //name = b.getPairedDevices().get(pos).getName();

        Display("Connecting...");
        b.connectToDevice(b.getPairedDevices().get(pos));
        /*
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String msg = message.getText().toString();
                message.setText("");
                b.send(msg);
                Display("You: "+msg);
            }
        });
        */
        IntentFilter filter = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        registerReceiver(mReceiver, filter);
        registered=true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if(registered) {
            unregisterReceiver(mReceiver);
            registered=false;
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.close:
                b.removeCommunicationCallback();
                b.disconnect();
                Intent intent = new Intent(this, Select.class);
                startActivity(intent);
                finish();
                return true;

            case R.id.rate:
                Uri uri = Uri.parse("market://details?id=" + this.getPackageName());
                Intent goToMarket = new Intent(Intent.ACTION_VIEW, uri);
                goToMarket.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY | Intent.FLAG_ACTIVITY_NEW_DOCUMENT | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                try {
                    startActivity(goToMarket);
                } catch (ActivityNotFoundException e) {
                    startActivity(new Intent(Intent.ACTION_VIEW,
                            Uri.parse("http://play.google.com/store/apps/details?id=" + this.getPackageName())));
                }
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    public void Display(final String s){
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //text.setText("just got" + s + "\n");
                speedText.setText(speed.get(speed.size() - 1));
                currentText.setText(current.get(current.size() - 1));
                chargeText.setText(charge.get(charge.size() - 1));
                voltageText.setText(voltage.get(voltage.size() - 1));
            }
        });
    }

    @Override
    public void onConnect(BluetoothDevice device) {
        Display("Connected to "+device.getName()+" - "+device.getAddress());
        /*this.runOnUiThread(new Runnable() {
            //@Override
            //public void run() {
            //    send.setEnabled(true);
            //}
        });*/
    }

    @Override
    public void onDisconnect(BluetoothDevice device, String message) {
        Display("Disconnected!");
        Display("Connecting again...");
        b.connectToDevice(device);
    }

    @Override
    public void onMessage(String message) {
        String[] findNum = message.split(": ");
        if(findNum[0].equals("speed")){
            speed.add(findNum[1]);
        } else if(findNum[0].equals("charge")){
            charge.add(findNum[1]);
        } else if(findNum[0].equals("current")){
            current.add(findNum[1]);
        } else if(findNum[0].equals("voltage")){
            voltage.add(findNum[1]);
        }
        Map<String, String> postData = new HashMap<>();
        postData.put("carId", carId);
        postData.put("indicator", findNum[0].substring(0, 3));
        postData.put("val", findNum[1]);
        HttpPostAsyncTask task = new HttpPostAsyncTask(postData);
        task.execute( url + "/update");
        Display(message);
    }

    @Override
    public void onError(String message) {
        Display("Error: "+message);
    }

    @Override
    public void onConnectError(final BluetoothDevice device, String message) {
        Display("Error: "+message);
        Display("Trying again in 3 sec.");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        b.connectToDevice(device);
                    }
                }, 2000);
            }
        });
    }

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();

            if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
                Intent intent1 = new Intent(Chat.this, Select.class);

                switch (state) {
                    case BluetoothAdapter.STATE_OFF:
                        if(registered) {
                            unregisterReceiver(mReceiver);
                            registered=false;
                        }
                        startActivity(intent1);
                        finish();
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:
                        if(registered) {
                            unregisterReceiver(mReceiver);
                            registered=false;
                        }
                        startActivity(intent1);
                        finish();
                        break;
                }
            }
        }
    };
}
