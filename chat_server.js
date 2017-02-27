var server = require('http').createServer();
var io = require('socket.io')(server);

var utils = require('./utils');
var exceptions = require('./exceptions');
var events = require('./events');

io.on('connection', function(client) {
	console.log("New connection !");
	
	client.username = null;
	client.password = null;
	client.room = null;
	
	client.on('auth', function(data) {
		if (!utils.hasProperties(data, events.AuthProperties, events.AUTH_STRICT)) {
			client.emit('cerror', {'code': 400, 'message': 'Authentification error'});
			console.log("Client authentification error ! (Properties)");
		}
		else
		{
			client.username = data.username;
			client.password = data.password;
			client.room = data.room;
			client.join(client.room, function() {
				client.emit('auth', {'code': 200, 'message': 'Authentification complete'});
				console.log("Client (" + client.username + ") Joined #" + client.room + "!");
			});
		}
	});
	
	client.on('message', function(data) {
		if (!utils.isAuth(client)) {
			utils.AuthentificationRequired(client);
			console.log("Client message error ! (Authentification)");
		}
		else if (!utils.hasProperties(data, events.MessageProperties, events.MESSAGE_STRICT)) {
			client.emit('cerror', {'code': 400, 'message': 'Message syntax error !'});
			console.log("Client message error ! (Properties)");
		}
		else
		{
			data.user = client.username;
			client.to(client.room).emit('message', data); // emit message to all client except sender
			client.emit('message', data); // emit to sender (proof of receive)
		}
	});
	
	client.on('disconnect', function(){
		console.log(client.username + " left !");
		client.username = null;
		client.room = null;
		client.password = null;
	});
});

server.listen(3005);