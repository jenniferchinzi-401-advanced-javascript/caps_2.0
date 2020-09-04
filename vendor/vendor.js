'use strict';
const faker = require('faker');

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000/caps');
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

// Commented out to manually trigger events through API Server
setInterval(start, 5000);

function start(){
  socket.emit('pickup', Order);
}

storeChannel.on('delivered', payload => {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
});

module.exports = {start};