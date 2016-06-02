var socket = io();

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
    socket.emit("challengeYes",msg.username);
  } else {
    socket.emit("challengeNo",msg.username);
  }
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
