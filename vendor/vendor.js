/*
Continue to declare your store id using .env
Connects to the CAPS server as a socket.io client to the caps namespace
Join a room named for your store
  - Emit a join event to the caps namespace connection, with the payload being your store code
Every .5 seconds, simulate a new customer order
  - Create a payload object with your store name, order id, customer name, address
  - Emit that message to the CAPS server with an event called pickup
Listen for the delivered event coming in from the CAPS server
  - Log “thank you for delivering payload.id” to the console
*/

'use strict';
const faker = require('faker');

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');
const storeChannel = io.connect('http://localhost:3000/flowers');

storeChannel.emit('join', '1-206-flowers');

const store = process.env.STORE_NAME || '1-206-flowers';
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
  socket.emit('pickup', Order);
}

storeChannel.on('delivered', payload => {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
});

module.exports = {start};