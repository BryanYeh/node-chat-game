var socket = io();
//
// USER LOGIN
//

// submit form login
$('#loginForm').submit(function() {
    socket.emit("login", $('#ln').val());
    $('#ln').val('');
    return false;
});

// error with username
socket.on('usernameError', function(error) {
    $('#loginError').text(error);
});

// login works
socket.on('login successful', function(msg) {
    $('#yourNickname').text(msg);
    $('#loginForm').hide();
    $('#ui').show();
    $('#messages').show();
    $('#message').show();
    $('#users').show();
    $('#overBox').show();
});

//
// USERS
//

// list out the online users
socket.on('users',function(usersList){
  $('#users').empty();
  for(var i = 0; i < usersList.length; i++){
    $('#users').append($('<li id="'+usersList[i]+'"><span class="btn btn-default challengeButton">'+usersList[i]+'</span></li>').click(function() {
        socket.emit("challenge", $(this).attr('id'));
        return false;
    }));
  }
});


//
// Game
//

// submit game form
$('.gameCell').click(function() {
    socket.emit("game move", $(this).attr('id'));
    return false;
});


// challenged
socket.on('challenged', function(msg) {
  if (confirm(msg.msg)) {
    $('#messages').append($('<li>').text("You accepted " + msg.username + "s challenge"));
    $('#gameTable').show();
    socket.emit("challengeYes",msg.username);
  } else {
    socket.emit("challengeNo",msg.username);
    $('#messages').append($('<li>').text("You declined " + msg.username + "s challenge"));
  }
});

// send user to private room
socket.on('game time',function(msg){
  $('#messages').append($('<li>').text(msg.username+": "+msg.msg));
  $('#gameTable').show();
  socket.emit("private room",msg.room);
});

// print board
socket.on('board',function(msg){
  $('#0').text(msg.board[0] != null ? msg.board[0] : "");
  $('#1').text(msg.board[1] != null ? msg.board[1] : "");
  $('#2').text(msg.board[2] != null ? msg.board[2] : "");
  $('#3').text(msg.board[3] != null ? msg.board[3] : "");
  $('#4').text(msg.board[4] != null ? msg.board[4] : "");
  $('#5').text(msg.board[5] != null ? msg.board[5] : "");
  $('#6').text(msg.board[6] != null ? msg.board[6] : "");
  $('#7').text(msg.board[7] != null ? msg.board[7] : "");
  $('#8').text(msg.board[8] != null ? msg.board[8] : "");
});

// game ended
socket.on('game over', function(message) {
    $('#messages').append($('<li>').text(message.username+": "+message.msg));
    socket.emit("toDefaultRoom");
    $('#gameTable').hide();
    $('#0').text("");
    $('#1').text("");
    $('#2').text("");
    $('#3').text("");
    $('#4').text("");
    $('#5').text("");
    $('#6').text("");
    $('#7').text("");
    $('#8').text("");
});

//
// Chatting
//

// submit form message
$('#message').submit(function() {
    socket.emit("chat", $('#ms').val());
    $('#ms').val('');
    return false;
});

// get chat messages
socket.on('chat message', function(message) {
    $('#messages').append($('<li>').text(message.username+": "+message.msg));
});


//
// Disconnecting
//

socket.on("disconnection", function(winner){
  $('#messages').append($('<li>').text(winner.username + ": " + winner.msg));
  socket.emit("toDefaultRoom");
});
