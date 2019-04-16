'use strict';


const connectionString = require('../connectionStrings').connectionStringDevice;

// the number of meesages to be sent to the server before termination
const THE_TOTAL_NUMBER_OF_MESSAGES = 50;

const DEVICE_ID = "device_1";
// Using the Node.js Device SDK for IoT Hub:
//   https://github.com/Azure/azure-iot-sdk-node
// The sample connects to a device-specific MQTT endpoint on your IoT Hub.
const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message;

const client = DeviceClient.fromConnectionString(connectionString, Mqtt);

let i = 0;

// Create a message and send it to the IoT hub every second
  const intervalId = setInterval(() => {
    // Simulate telemetry.
    const temperature = 20 + (Math.random() * 15);
    const message = new Message(JSON.stringify({
      temperature: temperature,
      moisture: 30 + Math.random() * 50,
      humidity: 20 + (Math.random() * (10 + i)),
      illumination: 18000 + Math.random() * 2000,
      id: DEVICE_ID
    }));
  
  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
  message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');

  console.log('Sending message: ' + message.getData());

  // Send the message.
  client.sendEvent(message, (err) => {
    if (err) {
      console.error('send error: ' + err.toString());
      return;
    } 
    console.log('message sent');
  });
  
  i++;
  if (i > THE_TOTAL_NUMBER_OF_MESSAGES) clearInterval(intervalId);

}, 1000);
