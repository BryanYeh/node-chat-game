var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ArrayList = require('arraylist');
var uuid = require('uuid');
var TicTacToeGame = require('./game/TicTacToe');
var PORT = process.env.PORT || '3000';

var onlineGamers = {};
var privateGame = {};
var game = {};

app.use('/', express.static(__dirname + '/public'));
app.use('/modules/', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket) {

    // user login
    socket.on('login', function(username) {
        if (username.length >= 5) {
            if (onlineGamers[username]) {
                socket.emit("usernameError", "Nickname (" + username + ") is already in use");
            } else {
                socket.join("default");
                onlineGamers[username] = socket.id;
                socket.username = username;
                socket.currentRoom = "default";
                socket.emit("login successful", username);
                io.emit("users", Object.keys(onlineGamers));
            }
        } else {
            socket.emit("usernameError", "nickname needs at least 5 characters");
        }
    });

    // user diconnected
    socket.on('disconnect', function() {
        if(socket.username != undefined){
          delete onlineGamers[socket.username];
          if (socket.currentRoom != "default") {
              privateGame[socket.currentRoom].removeElement(socket.username);
              socket.broadcast.to(onlineGamers[privateGame[socket.currentRoom].get(0)]).emit('disconnection', {
                  "username": "SERVER",
                  "msg": socket.username + " disconnected and you won"
              });
          }
          io.emit("users", Object.keys(onlineGamers));
        }
    });

    socket.on("toDefaultRoom", function() {
        delete privateGame[socket.currentRoom];
        socket.leave("socket.currentRoom");
        socket.join("default");
        socket.currentRoom = "default";
    });

    // user chats into current room
    socket.on('chat', function(msg) {
        io.to(socket.currentRoom).emit("chat message", {
            "username": socket.username,
            "msg": msg
        });
    });

    // user logout, user cant log out during a game
    socket.on('logout', function() {
        delete onlineGamers[socket.username];
        io.emit("users", Object.keys(onlineGamers));
    });

    // user challenges another user
    socket.on('challenge', function(user) {
        if (user != socket.username) {
            if (onlineGamers[user]) {
                socket.broadcast.to(onlineGamers[user]).emit('challenged', {
                    "username": socket.username,
                    "msg": "you got challenged by: " + socket.username + "\nDo tic em?"
                });
                socket.emit('chat message', {
                    "username": "SERVER",
                    "msg": "you challenged: " + user
                });
            } else {
                socket.emit("chat message", {
                    "username": "SERVER",
                    "msg": "no such username: " + user
                });
            }
        } else {
            socket.emit("chat message", {
                "username": "SERVER",
                "msg": "Don't tac yourself dumb fool!"
            });
        }
    });

    // user accepts challenge
    socket.on('challengeYes', function(user) {
        if (onlineGamers[user]) {
            var room = uuid.v1();
            socket.leave('default');
            socket.join(room);
            socket.currentRoom = room;
            privateGame[room] = [socket.username, user];
            game[room] = new TicTacToeGame(room);
            game[room].setPlayer(user,socket.username);
            socket.broadcast.to(onlineGamers[user]).emit('game time', {
                "username": "SERVER",
                "msg": "Your taced got accepted by: " + socket.username,
                "room": room
            });
        }
    });

    // user declines challenge
    socket.on('challengeNo', function(user) {
        if (onlineGamers[user]) {
            socket.broadcast.to(onlineGamers[user]).emit('chat message', {
                "username": socket.username,
                "msg": "Your taced got declined by: " + socket.username
            });
        }
    });

    //move challenger to private room
    socket.on("private room",function(room){
        socket.leave('default');
        socket.join(room);
        socket.currentRoom = room;

    });

    // player make a move
    socket.on("game move",function(num){
        if(game[socket.currentRoom].isTurn(socket.username)){
          if(game[socket.currentRoom].makeMove(num)){
            io.to(socket.currentRoom).emit("board", {
                "board": game[socket.currentRoom].printBoard()
            });
            if(game[socket.currentRoom].checkForWinner()){
              if(game[socket.currentRoom].checkForWinner() != "TIE")
                io.to(socket.currentRoom).emit("game over", {
                  "username": "SERVER",
                  "msg": game[socket.currentRoom].checkForWinner() + " has won the game"
                });
              else
                io.to(socket.currentRoom).emit("game over", {
                  "username": "SERVER",
                  "msg": "It's a tie game"
                });
            }
          }
        }
    });

});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});
