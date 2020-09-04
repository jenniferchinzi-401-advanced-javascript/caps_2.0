'use strict';

const messages = {
  // Waiting for Messages to Queue

};

const io = require('socket.io')(process.env.PORT || 3000);


io.on('connection', socket => {

  console.log('CONNECTED', socket.id);

});


const caps = io.of('/caps');

caps.on('connection', socket => {

  console.log('CAPS Connection', socket.id);

  socket.on('join', room => {
    console.log('registered as', room);
    socket.join(room);
  });
  
  socket.on('pickup', payload => {
    
    // We need to queue up pickup messages
    messages[payload.orderId] = payload;
    
    
    let eventName = 'pickup';
    logEvent(eventName, payload);
    caps.emit('pickup', payload);

    console.log('pickup', Object.keys(messages).length);
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
  
  socket.on('received', orderId => {
    
    delete messages[orderId];
    
  });
  
  socket.on('get-all', () => {
    
    for(let id in messages){
      const payload = messages[id];
      caps.emit('pickup', payload);
    }
    
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