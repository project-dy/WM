const express = require('express');
const WebSocket = require('ws');

const midiDeviceNum = 0;

const app = express();
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const wss = new WebSocket.Server({ server });
let $ws = null;
wss.on('connection', (ws) => {
  $ws = ws;
  ws.on('message', (message) => {
    //console.log(`Received message: ${message}`);
    //ws.send(`Server received your message: ${message}`);
    handleRequest(JSON.parse(message), ws);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

/*app.get('/', (req, res) => {
  res.send('Hello, World!');
});*/

function handleRequest(message, ws) {
  //res.send('Hello, World!');
  switch(message.command) {
    case 'ping':
      ws.send(JSON.stringify({"response": "pong"}));
      //console.log('Sent message: {"response": "pong"}');
      break;
    default:
      ws.send('Unknown command');
      console.log('Received unknown command:', message.command);
  }
}

const midi = require('midi');

// Set up a new input.
const input = new midi.Input();

// Count the available input ports.
input.getPortCount();

// Get the name of a specified input port.
input.getPortName(midiDeviceNum);

// Configure a callback.
input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`m: ${message} d: ${deltaTime}`);
  if ($ws != null)
    $ws.send(JSON.stringify({"response": "midi", "message": message, "deltaTime": deltaTime}));
});

// Open the first available input port.
input.openPort(0);