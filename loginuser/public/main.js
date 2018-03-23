$(function() {
  var FADE_TIME = 150; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var pageid = 2;
  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var socket = io();
  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    var data = {username:username,pageid:pageid};
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      // Tell the server your username
      socket.emit('add user', data);
    }
  }


  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html();
  }
  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });
  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    //addParticipantsMessage(data);
  });
  socket.on('disconnect', function () {
   // log('you have been disconnected');
  });
  socket.on('reconnect', function () {
    if (username) {
      socket.emit('add user', username);
    }
  });
  socket.on('pagechat', function(data) {
    $('.user').html('');
    for (var i = data.loginuser.length - 1; i >= 0; i--) {
      data.loginuser[i]
          $('.user').append('<li>'+data.loginuser[i]+'</li>');
    }
  });
  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

});
