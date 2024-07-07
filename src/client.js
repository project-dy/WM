const ws = require("ws");
const WebSocket = ws.WebSocket;

const midiDeviceNum = 3;

async function connect() {
  let pingpong = 0;
  let $pong = 0;
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established");
    ping();
  });

  socket.addEventListener("message", (event) => {
    //console.log("Received message:", event.data);
    handleResponse(JSON.parse(event.data));
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket connection closed");
    connect();
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  function ping() {
    setInterval(() => {pingFunc()}, 1000);
  }
  
  function pingFunc() {
    pingpong++;
    //console.log('Sending message: {"command": "ping"}');
    socket.send(JSON.stringify({"command": "ping"}));
  }
  
  function handleResponse(response) {
    switch(response.response) {
      case 'pong':
        $pong++;
        //console.log('Received response: {"response": "pong"}');
        if(pingpong != $pong) {
          console.log('Missed pongs:', pingpong - $pong);
        }
        break;
      case 'midi':
        console.log('Received response:', response);
        playMIDI(response.message);
        break;
      default:
        console.log('Received unknown response:', response);
    }
  }

}

connect();

const midi = require('midi');

// Set up a new output.
const midiOutput = new midi.Output();

// Count the available output ports.
midiOutput.getPortCount();

// Get the name of a specified output port.
console.log(midiOutput.getPortName(midiDeviceNum));

// Open the first available output port.
//midiOutput.openVirtualPort("Client");
midiOutput.openPort(midiDeviceNum);


function playMIDI(list) {
  //console.log('Playing MIDI:', list);
  midiOutput.sendMessage(list);
}