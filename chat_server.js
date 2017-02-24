var server = require('http').createServer();
var io = require('socket.io')(server);

function AuthentificationRequired(client) {
	client.emit('cerror', {'code': 401, 'message': 'Authentification required'});
}

function isAuth(client)
{
	return client.username && client.password && client.room;
}

io.on('connection', function(client) {
	console.log("New connection !");
	
	client.username = null;
	client.password = null;
	client.room = null;
	
	client.on('Auth', function(data) {
		if (!data.hasOwnProperty("user") ||
			!data.hasOwnProperty("password") ||
			!data.hasOwnProperty("room"))
			client.emit('cerror', {'code': 400, 'message': 'Authentification error'});
		else
		{
			client.username = data.user;
			client.password = data.password;
			client.room = data.room;
			client.join(client.room, function() {
				client.emit('Auth', {'code': 200, 'message': 'Authentification complete'});
				console.log("Client (" + client.username + ") Joined #" + client.room + "!");
			});
		}
	});
	
	//client.on('event', function(data){});
	
	client.on('message', function(data) {
		if (!isAuth(client))
			AuthentificationRequired(client);
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