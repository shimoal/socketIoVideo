var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numUsers = 0;
var roomNo = 1;
var user1;
var user2;

app.use(express.static(__dirname + '/../public'));

io.on('connection', function(socket) {
  console.log('A user connected!');
  numUsers++;

  socket.join("room-" + roomNo);


  socket.on('call', function(name) {
    socket.broadcast.emit('receiveCall', name);
  });

  socket.on('answer', function(name) {
    socket.broadcast.emit('receiveAnswer', name);
  })

  socket.on('sendCall', function(name) {
    socket.emit('answerCall', name);
  })

  io.sockets.in("room-"+roomNo).emit('newUser', numUsers);

  socket.on('disconnect', function() {
    socket.leave("room-" + roomNo);
    console.log('A user disconnected');
    numUsers--;
  })
})

http.listen(3000, function() {
  console.log('listening on port 3000');
})