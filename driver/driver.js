/*
This application is intended to be run by delivery drivers in their vehicles. If the application is running, say on their phone, anytime a package is ready for pickup, they would get a notification. When they pickup the package, they might hit a button to let the system know that the package is in transit. And once they deliver the package to the customer, they could again hit a button that would let everyone (especially the store owner) know that the package was delivered.

Application Workflow

Connect to the CAPS server
Listen for the data event coming in from the CAPS server
When data arrives, parse it (it should be JSON) and look for the event property and begin processing…
If the event is called pickup:
Simulate picking up the package
- Wait 1 second
- Log “picking up id” to the console
- Create a message object with the following keys:
  - event - ‘in-transit’
  - payload - the payload from the data object you just received
- Write that message (as a string) to the CAPS server
Simulate delivering the package
- Wait 3 seconds
- Create a message object with the following keys:
  - event - ‘delivered’
  - payload - the payload from the data object you just received
- Write that message (as a string) to the CAPS server
*/

'use strict';

const net = require('net');

const client = new net.Socket();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
client.connect(port, host, () => {});



client.on('data', function(data){

  let event = JSON.parse(data);

  if (event.event === 'pickup'){
    setTimeout(() => {
      console.log(`DRIVER: picked up ${event.payload.orderId}`);
      let transitEvent = JSON.stringify({event: 'in-transit', payload: event.payload});
      client.write(transitEvent);
    }, 1000);

    setTimeout(()=>{
      console.log(`DRIVER: delivered ${event.payload.orderId}`);
      let deliveredEvent = JSON.stringify({event: 'delivered', payload: event.payload});
      client.write(deliveredEvent);
    }, 3000);

  }

});