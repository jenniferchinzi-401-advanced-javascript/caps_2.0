/*
This application is intended to be run by store owners. As soon as they have a package ready for pickup/delivery, they will be sending an event to the hub server with the data describing the delivery. Additionally, the application needs to be listening to the server for other events. Store owners definitely want to know when their packages are picked up, and when they actually get delivered.

Application Workflow

Use .env to set your store name
Connect to the CAPS server
Every 5 seconds, simulate a new customer order
Create an order object with your store name, order id, customer name, address
HINT: Have some fun by using the faker library to make up phony information
Create a message object with the following keys:
event - ‘pickup’
payload - the order object you created in the above step
Write that message (as a string) to the CAPS server
Listen for the data event coming in from the CAPS server
When data arrives, parse it (it should be JSON) and look for the event property
If the event is called delivered
Log “thank you for delivering id” to the console
Ignore any data that specifies a different event
*/

'use strict';
const faker = require('faker');

const net = require('net');
const client = new net.Socket();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
client.connect(port, host, () => {});

const store = process.env.STORE_NAME || 'Rose-Emporium';
let orderId = faker.random.uuid();
let customerName = faker.name.findName();
let address = faker.address.streetAddress();

const Order = {
  store,
  orderId,
  customerName,
  address,
};

setInterval(start, 5000);

function start(){

  let event = JSON.stringify({event: 'pickup', payload: Order});
  client.write(event);

}

client.on('data', function(data){

  let event = JSON.parse(data);

  if (event.event === 'delivered'){
    console.log(`VENDOR: Thank you for delivering ${event.payload.orderId}`);
  }

})