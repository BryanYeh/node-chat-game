var socket = io();


// submit form message
$('form').submit(function() {
    socket.emit($('#check').val(), $('#m').val());
    $('#m').val('');
    return false;
});

// error with username
socket.on('usernameError', function(error) {
    $('#messages').append($('<li>').text(error));
});

// login works
socket.on('login successful', function(msg) {
    $('#but').text("Send");
    $('#check').val("chat");
    $('#messages').append($('<li>').text(msg));
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
