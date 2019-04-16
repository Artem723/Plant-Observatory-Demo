# Plant-Observatory-Demo
A small demo that demonstrates communication between device and back-end application through Microsoft Azure IoT hub. The communicated data is indexed in an Elasticsearch instance.

## Idea
The idea of this demo is to demonstrate a way of building a system that monitors the environment over plants and indexes everything in elasticsearch for analysis collected data. 

## Getting started

### Configuration and dependencies
In order to start, create in the root of the project a `connectionStrings.js` file and write there the following:

```js

module.exports.connectionStringBackend = "<CONNECTION_STRING_FOR_APPLICATION>";
module.exports.connectionStringDevice = "< CONNECTION_STRING_FOR_DEVICE >";
module.exports.elasticHostURI = "< URI_TO_ELASTIC_INSTANCE >";

```
Replace the `CONNECTION_STRING_FOR_APPLICATION` and `CONNECTION_STRING_FOR_DEVICE` with values from the IoT hub.
And replace the `< URI_TO_ELASTIC_INSTANCE >` by your URI to Elastic instance.

Then install all required dependencies, run once in the folders `/backend` and `/device` the following command:

```sh

npm install

```
### Usage

To run the device, go to the folder `/device` and execute the following command:

```sh

npm start

```

To run the application, execute the same command but in the `/backend` folder.

By default, the device sends 50 generated messages and then terminates. To change the default number of messages modify the `THE_TOTAL_NUMBER_OF_MESSAGES` variable in the `/device/index.js` file.

Enjoy!

## Licence
MIT
