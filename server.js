// server.js
var express = require('express');
var app = express();
var server = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(server);
var port = 3000;

//create the node server and serve the files
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
server.listen(port);
console.log('Server started, page available at http://localhost:' + port);

//Arduino board connection
var led;
var board = new five.Board();
board.on("ready", function() {
    servo = new five.Servo({
      pin: 10,
      center: true
    });
    console.log('Arduino connected');

//SocketIO connection handler and listening
io.on('connection', function (socket) {
        console.log("your socket id is ", socket.id);

        socket.on('servo:sweep', function () {
            servo.sweep();
            console.log('SERVO SWEEP RECEIVED');
        });

        socket.on('servo:stop', function () {
            servo.stop();
            console.log('SERVO STOP RECEIVED');
        });

        socket.on('servo:90', function () {
            servo.to(90);
            console.log('set to 90');
        });

        socket.on('servo:angle', function(data) {
            servo.to(data);
            console.log('set to ' + data );
        });

        socket.on('disconnect', function() {
          console.log('browser closed');
        })
    });
    
});
    
//if nothing else is happened yet.
console.log('Waiting for arduino connection..');
