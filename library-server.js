const express = require('express');
const bodyParser = require('body-parser');
const http = require('http'); // Import the http module
const { Server } = require("socket.io");

const app = express();
const port = 2929;

// Create an HTTP server
const server = http.createServer(app);

// Pass the server instance to Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Array to store RFID tag data
const tagDataArray = [];

// Route to handle POST requests to /tagData
app.post('/tagData', (req, res) => {
  // Extract tag data from the request body
  const tagData = req.body.tagData;

  // Process the tag data (e.g., store it in the array)
  console.log('Received tag data:', tagData);
  tagDataArray.push(tagData);

  // Emit the tag data to all connected clients
  io.emit('tagData',  tagData);

  // Send a response back to the Arduino
  res.send('Tag data received successfully');
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});