var socket = io();



$('form').submit(function() {
    socket.emit('login', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('username exists', function() {
    $('#messages').append($('<li>').text("Username you provided already existed, try to login again"));
});
socket.on('login successful', function() {
    $('#messages').append($('<li>').text("You logged in successfully"));
});
socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
});