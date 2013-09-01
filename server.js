var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

// Roteamento para servir arquivos estáticos.
app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/audios", express.static(__dirname + '/public/audios'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/game', function (req, res) {
	res.sendfile(__dirname + '/public/game.html');
});

// usuários conectados ao jogo.
var usernames = {};

// salas disponíveis no jogo.
var rooms = {
	'001': {
		countUsuarios: 0
	},
	'002': {
		countUsuarios: 0
	},
	'003': {
		countUsuarios: 0
	},
	'004': {
		countUsuarios: 0
	}
};

io.sockets.on('connection', function (socket) {
	
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;

		// usuário entra na primeira sala vaga encontrada
		room = getAvailableRoom()
		socket.room = room;
		rooms[room].countUsuarios++;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join(room);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + room);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, room);
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		rooms[socket.room].countUsuarios++;
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});
	

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
		rooms[socket.room].countUsuarios++;
	});
});

function getAvailableRoom() {
	for (var room in rooms) {
		if (rooms[room].countUsuarios < 2) {
			return room;
		}
	}
	return -1;
} 