const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var config = {
  password: process.env.password
};

server.listen(8000);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send('Something broke!');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
  console.log("A client connected!")
  socket.on("sendMessage", (data) => {
    if (data.password !== config.password) return;
    io.emit("message", {target: data.target, message: data.message});
  });
  socket.on("disconnect", () => {
    console.log("A client disconnected!");
  });
});

console.log("Ready!");
