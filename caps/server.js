/*
The Hub Server has one job – accept all inbound events and data, validate them, and and then re-broadcast them to everyone except the sender. It doesn’t perform any logic other than to ensure that the inbound events are properly formatted before it broadcasts them.

Creates a pool of connected clients
Accept inbound TCP connections on a declared port
On new connections, add the client to the connection pool
On incoming data from a client
- Read and parse the incoming data/payload
- Verify that the data is legitimate
- Is it a JSON object with both an event and payload properties?
- If the payload is ok, broadcast the raw data back out to each of the other connected clients
*/

'use strict';

const net = require('net');

const port = process.env.PORT || 3000;
const server = net.createServer();

server.listen(port, () => console.log(`server up on ${port}`));

let socketPool = {};

server.on('connection', (socket) => {
  
  const id = `Socket-${Math.random()}`;

  socketPool[id] = socket;

  socket.on('data', buffer => onMessageReceived(buffer.toString()));

  socket.on('error', (error) => {
    console.log('SOCKET ERROR', error);
  });
  //if there are issues, try changing 'end' to 'close' 
  socket.on('end', (e) => {
    delete socketPool[id];
  });
});

server.on('error', (error) => {
  console.log('SERVER ERROR', error.message);
});

function onMessageReceived(str){

  logEvent(str);
  broadcast(str);

}

function logEvent(str){

  const messageObject = JSON.parse(str);
  const eventName = messageObject.event;
  const time = new Date();
  const payload = messageObject.payload;

  console.log('EVENT', {event: eventName, time, payload});
}

function broadcast(str){
  for(let socket in socketPool){
    socketPool[socket].write(str);
  }
}