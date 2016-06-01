var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ArrayList = require('arraylist');
var PORT = process.env.PORT || '3000';


app.use('/', express.static(__dirname + '/public'));
app.use('/modules/', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var onlineGamers = {};
var privateGame = new ArrayList();

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
    socket.on('disconnect', function() {
      delete onlineGamers[socket.username];
      io.emit("users",Object.keys(onlineGamers));
    });

    // user default room chat
    socket.on('chat', function(msg) {
        io.to('default').emit("chat message",{"username":socket.username,"msg":msg});
    });

    //user logout
    socket.on('logout', function() {
      delete onlineGamers[socket.username];
      io.emit("users",Object.keys(onlineGamers));
    });

});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});
