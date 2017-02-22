
var socket = io();

var videoConfiguration = {
  audio: true,
  video: true
};

var roomname = 1;


socket.on('newUser', function(data) {
  $('#numOfUsers').html(data);
});

var signalingChannel = socket;
var pc;

var configuration = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19302'
  }]
};

// run start(true) to initiate a call
function start(isCaller) {

  //pc will be created for both caller and answerer
    pc = new RTCPeerConnection(configuration);
    console.log('set pc: ', pc);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
      console.log('send ice candidates:', evt);
      signalingChannel.emit('sendCandidate', (JSON.stringify({ "candidate": evt.candidate })));
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
      console.log('adding remote stream');
      
      $("#peer-camera video")[0].src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
      $("#my-camera video")[0].src = URL.createObjectURL(stream);

      pc.addStream(stream);

      if (isCaller){
          pc.createOffer(gotDescription, function(err) { console.log('error: ', err); });          
      } else {
          pc.createAnswer(gotDescription, function(err) { console.log('error: ', err); });          
      }


      function gotDescription(desc) {
          pc.setLocalDescription(desc);

          signalingChannel.emit('sendDescription', JSON.stringify({ "sdp": desc }));
      }
    });
}



signalingChannel.on('description', function (evt) {
    if (!pc) {
      start(false);      
    }

    var description = (JSON.parse(evt)).sdp;

    console.log('setting remote description');
    pc.setRemoteDescription(new RTCSessionDescription(description));

});

signalingChannel.on('candidate', function (evt) {
  if (!pc) {
    start(false);
  }

  var candidate = (JSON.parse(evt)).candidate;

  pc.addIceCandidate(new RTCIceCandidate(candidate));
})


$("#start-call").click(function() {
    //caller sends their name


    start(true);
});
