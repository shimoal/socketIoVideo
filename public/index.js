
var socket = io();
var username = "Alice";
var peer = "Bob";

var videoConfiguration = {
  audio: true,
  video: true
};

navigator.mediaDevices.getUserMedia(videoConfiguration)
  .then(function(stream) {
    window.localStream = stream;
    $("#my-camera video")[0].src = window.URL.createObjectURL(stream);
  }).catch(function(err) {
    console.log('Error getting video stream: ', err);
  });

$("#start-call").click(function() {
    socket.emit('call', username); 
});

socket.on('receiveCall', function(data) {
  $('#peerName').html(data);
  socket.emit('answer', peer);
});

socket.on('receiveAnswer', function(data) {
  console.log('inside recieve Answer on client');
  $('#peerName').html(data);
})

socket.on('newUser', function(data) {
  $('#numOfUsers').html(data);
});
