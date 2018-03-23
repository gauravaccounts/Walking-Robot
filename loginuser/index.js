// Setup basic express server
var express = require('express');
var app     = express();
var path    = require('path');
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var port    = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(path.join(__dirname, 'public')));
// Chatroom
var numUsers = 0;
var currLogin = [];
var key =0;
var count = 0;
var loginuser = [];

io.on('connection', function (socket) {
  var addedUser = false;
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (data) {
    if (addedUser) return;
    var username  = data.username;
    //var pageid    = data.pageid;
    socket.pageid = data.pageid;

    key++;
    socket.join(socket.pageid);
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    var userData = {pageid:socket.pageid,username:username};
    currLogin.push(userData);
    loginuser = [];
    for(var i = 0; i < currLogin.length; ++i){
        if(currLogin[i]['pageid'] == data.pageid){
          count++;
          loginuser.push(currLogin[i]['username'])
        }
    }
    io.sockets.in(data.pageid).emit('pagechat',{
              message: data,
              totalLogin :count,
              loginuser:loginuser,
      });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

    for(var i = 0; i < currLogin.length; ++i){
        if((currLogin[i]['pageid'] == socket.pageid) && (currLogin[i]['username'] == socket.username ))
        {
          --count;
          var index = loginuser.indexOf(socket.username);
                    if (index > -1) {
              loginuser.splice(index, 1);
          }
          currLogin.splice(i,1);
        }
    }
    io.sockets.in(socket.pageid).emit('pagechat',{
              totalLogin :count,
              loginuser:loginuser,
      });
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
