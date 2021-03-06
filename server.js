var express = require('express');
var app = express();

// routes
app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');  
});

app.get('/foo', function(req, res){
  res.send('foo!');
});

app.get('/news', function(req, res) {
  res.sendfile(__dirname + '/news.html');
});


// socket.io
var io = require('socket.io').listen(app.listen(3000));

io.sockets.on('connection', function(socket){

  console.log('Connection established with a client');
  io.sockets.emit('client connected', socket.id);

  // this event will occur in the client as soon 
  // as the connection is established
  socket.emit('news', { hello: 'world' });

  socket.on('my other event', function (data) {
    console.log(data);
  });

  io.sockets.emit('this', { will: 'be received by everyone'});

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('client disconnected', socket.id);
  });

});


// socket.io namespaced on /news
io.of('/news').on('connection', function(socket) {

  console.log('Connection established with a client on /news');
  
  socket.emit('handshake', { socket_id: socket.id, namespace: '/news'});

  socket.emit('ping', 'ping');

  socket.on('pong', function(message_from_client){
    console.log(message_from_client);
  });
});


// Setup termination handlers (for exit and a list of signals).
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {

  process.on(element, function(){

    console.log('%s: Received %s - terminating...', Date(Date.now()), element);
    process.exit(1);
  });
});


console.log('Listening on http://localhost:3000');
