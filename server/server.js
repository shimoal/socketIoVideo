var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numUsers = 0;
var roomNo = 1;
var port = process.env.PORT || 3000;




app.use(express.static(__dirname + '/../public'));

io.on('connection', function(socket) {
  console.log('A user connected!');
  numUsers++;

  socket.join("room-" + roomNo);


  socket.on('sendDescription', function(data) {
    socket.broadcast.emit('description', data);
  });


  socket.on('sendCandidate', function(data){
    socket.broadcast.emit('candidate', data);
  });


  io.sockets.in("room-"+roomNo).emit('newUser', numUsers);

  socket.on('disconnect', function() {
    numUsers--;
    socket.leave("room-" + roomNo);
    io.sockets.in("room-"+roomNo).emit('newUser', numUsers);
    console.log('A user disconnected');
  })
})

http.listen(port, function() {
  console.log('listening on port ' + port);
})