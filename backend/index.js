'use strict';

const { connectionStringBackend, elasticHostURI } = require('../connectionStrings');

// Using the Node.js SDK for Azure Event hubs:
//   https://github.com/Azure/azure-event-hubs-node
const { EventHubClient, EventPosition } = require('@azure/event-hubs');

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: elasticHostURI })


const printError = (err) => {
  console.error(err.message);
};

// a template of options for elastic indexing
const elasticOptions = {
  index: 'plant',
  type: "_doc",
  id: null,
  body: null,
};

// Display the message content - telemetry and properties.
// - Telemetry is sent in the message body
// - The device can add arbitrary application properties to the message
// - IoT Hub adds system properties, such as Device Id, to the message.
const processMessage = async (message) => {
  
  // creating the indexed document
  const body = {
    recordedAt: (new Date()).toISOString(),
    id: message.body.id,
    data: {
      temperature: message.body.temperature,
      humidity: message.body.humidity,
      moisture: message.body.moisture,
      illumination: message.body.illumination,
    }
  }
  elasticOptions.body = body;
  elasticOptions.id = `${body.recordedAt}__${body.id}`;
  let result;
  // index received message to the elastic 
  try {
    result = await client.index(elasticOptions);
  } catch (err) {
    console.log(err);
  }
  console.log(`Status code:  ${result.statusCode}`);
};

// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This example only reads messages sent after this application started.
let ehClient;
EventHubClient.createFromIotHubConnectionString(connectionStringBackend).then((client) => {
  console.log("Successfully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then((ids) => {
  console.log("The partition ids are: ", ids);
  return ids.map((id) => {
    return ehClient.receive(
      id, 
      processMessage,
      printError,
      { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) }
    );
  });
}).catch(printError);

