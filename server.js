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

var onlineGamers = new ArrayList();
var privateGame = new ArrayList();

io.on('connection', function(socket) {
    // user login
    socket.on('login', function(username) {
        //length of username have to be 5+
        if (username.length >= 5) {
            //check if username exists
            if (onlineGamers.indexOf(username) > -1) {
                socket.emit("username exists");
            } else {
                socket.join("default");
                onlineGamers.push(username);
                socket.username = username;
                socket.onlineId = onlineGamers.indexOf(username);
                socket.emit("login successful");
            }
        }
    });

    // user disconnected
    socket.on('disconnect', function() {

    });

    // user chats
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});