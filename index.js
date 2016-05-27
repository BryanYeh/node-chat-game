var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || '3000';
// var IP = process.env.IP;
app.use(express.static(__dirname)); 
// app.use('/static',express.static(__dirname + 'css'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(PORT, function(){
  console.log('listening on *:3000');
});
