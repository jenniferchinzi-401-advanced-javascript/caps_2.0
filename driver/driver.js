'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000/caps');

socket.emit('get-all');

socket.on('pickup', payload => {

  socket.emit('received', payload.orderId);

  setTimeout(() => {
    console.log(`DRIVER: picked up ${payload.orderId}`);
    socket.emit('in-transit', payload);
  }, 1000);

  setTimeout(()=>{
    console.log(`DRIVER: delivered ${payload.orderId}`);
    socket.emit('delivered', payload);
  }, 3000);

});


