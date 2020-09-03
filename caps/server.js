/*
Start a socket.io server on a designated port
Create and accept connections on a namespace called caps
Within the namespace:
  - Monitor the ‘join’ event.
    -  Each vendor will have their own “room” so that they only get their own delivery notifications
Monitor the correct general events
  - pickup, in-transit, delivered
  - Broadcast the events and payload back out to the appropriate clients in the caps namespace
    - pickup can go out to all sockets (broadcast it) so that the drivers can hear it
    - in-transit and delivered are meant to be heard only by the right vendor
      - Emit those messages and payload only to the room (vendor) for which the message was intended
*/

'use strict';

const io = require('socket.io')(process.env.PORT || 3000);


io.on('connection', socket => {

  console.log('CONNECTED', socket.id);

  socket.on('pickup', payload => {
    let eventName = 'pickup';
    logEvent(eventName, payload);
    io.emit('pickup', payload);
  });

  socket.on('in-transit', payload => {
    let eventName = 'in-transit';
    logEvent(eventName, payload);
    confirmTransit(payload);
  });

  socket.on('delivered', payload => {
    let eventName = 'delivered';
    logEvent(eventName, payload);
    confirmDelivery(payload);
  });

});


const store = io.of('/flowers');
store.on('connection', socket => {
  
  console.log('STORE CHANNEL', socket.id);
  
  socket.on('join', room => {
    console.log('joined', room);
    socket.join(room);
  });


});


function logEvent(eventName, payload){
  const time = new Date();
  console.log('EVENT', {event: eventName, time, payload});
}

function confirmTransit(payload){
  store.to('1-206-flowers').emit('in-transit', payload);
}

function confirmDelivery(payload){
  store.to('1-206-flowers').emit('delivered', payload);

}