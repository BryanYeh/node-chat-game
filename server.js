var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ArrayList = require('arraylist');
var uuid = require('uuid');
var PORT = process.env.PORT || '3000';


app.use('/', express.static(__dirname + '/public'));
app.use('/modules/', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var onlineGamers = {};
var privateGame = {};

io.on('connection', function(socket) {

    // user login
    socket.on('login', function(username) {
        if (username.length >= 5) {
            if (onlineGamers[username]) {
                socket.emit("usernameError","Username (" + username + ") is already in use");
            } else {
                socket.join("default");
                onlineGamers[username] = socket.id;
                socket.username = username;
                socket.currentRoom = "default";
                socket.emit("login successful", "Your username is: " + username);
                io.emit("users",Object.keys(onlineGamers));
            }
        }
        else{
            socket.emit("usernameError","username needs at least 5 characters");
        }
    });

    // user diconnected
    // TODO: need to move other not disconnecting player into default room
    socket.on('disconnect', function() {
      delete onlineGamers[socket.username];
      if(socket.currentRoom != "default"){
        privateGame[socket.currentRoom].removeElement(socket.username);
        socket.broadcast.to(onlineGamers[privateGame[socket.currentRoom].get(0)]).emit('disconnection',{"username":"SERVER","msg":socket.username + "disconnected and you won"});
      }
      io.emit("users",Object.keys(onlineGamers));
    });

    socket.on("toDefaultRoom", function(){
      delete privateGame[socket.currentRoom];
      console.log(privateGame);
      socket.leave("socket.currentRoom");
      socket.join("default");
      socket.currentRoom = "default";
    });

    // user default room chat
    socket.on('chat', function(msg) {
        io.to('default').emit("chat message",{"username":socket.username,"msg":msg});
    });

    // user logout, user cant log out during a game
    socket.on('logout', function() {
      delete onlineGamers[socket.username];
      io.emit("users",Object.keys(onlineGamers));
    });

    // user challenges another user
    socket.on('challenge',function(user){
      if(user != socket.username){
        if(onlineGamers[user]){
           socket.broadcast.to(onlineGamers[user]).emit('challenged', {"username":socket.username,"msg":"you got challenged by: "+socket.username+"\nDo tic em?"});
           socket.emit('chat message', {"username":socket.username,"msg":"you challenged: "+user});
        }
        else{
          socket.emit("chat message",{"username":socket.username,"msg":"no such username: "+ user});
        }
      }
      else{
        socket.emit("chat message",{"username":socket.username, "msg":"Don't tac yourself dumb fool!"});
      }
    });

    // user accepts challenge
    socket.on('challengeYes',function(user){
      if(onlineGamers[user]){
          var room = uuid.v1();
          socket.leave('default');
          socket.join(room);
          socket.currentRoom = room;
          privateGame[room] = new ArrayList;
          privateGame[room].add([socket.username, user]);
         socket.broadcast.to(onlineGamers[user]).emit('chat message', {"username":socket.username,"msg":"Your taced got accepted by: "+socket.username,"room":room});
      }
      else{
        // TODO: send back to socket.username user doesnt exist
        // socket.emit("chat message",{"username":socket.username,"msg":"no such username: "+ user})
      }
    });

    // user declines challenge
    socket.on('challengeNo',function(user){
      if(onlineGamers[user]){
         socket.broadcast.to(onlineGamers[user]).emit('chat message', {"username":socket.username,"msg":"Your taced got declined by: "+socket.username});
      }
    });

});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});
