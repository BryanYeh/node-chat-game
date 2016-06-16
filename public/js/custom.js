var socket = io();

// submit game form
$('#gameForm').submit(function() {
    socket.emit("game move", $('#move').val());
    $('#move').val('');
    return false;
});

// submit form login
$('#loginForm').submit(function() {
    socket.emit("login", $('#ln').val());
    $('#ln').val('');
    return false;
});

// submit form challenge
$('#challengeForm').submit(function() {
    socket.emit("challenge", $('#te').val());
    $('#te').val('');
    return false;
});

// challenged
socket.on('challenged', function(msg) {
  if (confirm(msg.msg)) {
    $('#messages').append($('<li>').text("You accepted " + msg.username + "s challenge"));
    socket.emit("challengeYes",msg.username);

  } else {
    socket.emit("challengeNo",msg.username);
    $('#messages').append($('<li>').text("You declined " + msg.username + "s challenge"));
  }
});

socket.on("disconnection", function(winner){
  $('#messages').append($('<li>').text(winner.username + ": " + winner.msg));
  socket.emit("toDefaultRoom");
});

// submit form message
$('#message').submit(function() {
    socket.emit("chat", $('#ms').val());
    $('#ms').val('');
    return false;
});

// error with username
socket.on('usernameError', function(error) {
    $('#messages').append($('<li>').text(error));
});

// login works
socket.on('login successful', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $('#login').hide();
});

// get chat messages
socket.on('chat message', function(message) {
    $('#messages').append($('<li>').text(message.username+": "+message.msg));
});

// list out the online users
socket.on('users',function(usersList){
  $('#users').empty();
  for(var i = 0; i < usersList.length; i++){
    // TODO: attach a button with class="challenge" and value=usersList[i] and id=usersList[i]
    $('#users').append($('<li>').text(usersList[i]));
  }
});

// send user to private room
socket.on('game time',function(msg){
  $('#messages').append($('<li>').text(msg.username+": "+msg.msg));
  socket.emit("private room",msg.room);
});

// print board
socket.on('board',function(msg){
  $('#messages').append($('<li>').text("-----------------------"              ));
  $('#messages').append($('<li>').text(msg.board[0]+"|"+msg.board[1]+"|"+msg.board[2]));
  $('#messages').append($('<li>').text(msg.board[3]+"|"+msg.board[4]+"|"+msg.board[5]));
  $('#messages').append($('<li>').text(msg.board[6]+"|"+msg.board[7]+"|"+msg.board[8]));

});
