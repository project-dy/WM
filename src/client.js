const ws = require("ws");
const WebSocket = ws.WebSocket;

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
      default:
        console.log('Received unknown response:', response.response);
    }
  }

}

connect();

