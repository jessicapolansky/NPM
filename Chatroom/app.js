const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/chat.html');
});

io.on('connection', function(socket){
    io.emit('enter');
  socket.on('disconnect', function(socket){
    io.emit('leave');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.join('socket id', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms);
});
});



http.listen(8080, function(){
  console.log('listening on 8080');
});

