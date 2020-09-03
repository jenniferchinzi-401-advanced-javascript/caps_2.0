/*
Connects to the CAPS server as a socket.io client to the caps namespace
Listen for the pickup event coming in from the CAPS server
  - Simulate picking up the package
    - Wait 1.5 seconds
    - Log “picking up payload.id” to the console
    - emit an in-transit event to the CAPS server with the payload
  - Simulate delivering the package
    - Wait 3 seconds
    - emit a delivered event to the CAPS server with the payload
*/

'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('pickup', payload => {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${payload.orderId}`);
    socket.emit('in-transit', payload);
  }, 1000);

  setTimeout(()=>{
    console.log(`DRIVER: delivered ${payload.orderId}`);
    socket.emit('delivered', payload);
  }, 3000);
});


