const https = require('https');
const API_URL = "api.twicecast.ovh";
const server = require('http').createServer();
const io = require('socket.io')(server);

const utils = require('./utils');
const exceptions = require('./exceptions');
const events = require('./events');

const config = require('./config');

const EventManager = require('./chatEvents/EVENTS');
const ClientManager = require('./ClientManager');

io.on('connection', function(client) {
	console.log("New connection !");
	
	client.username = null;
	client.password = null;
	client.room = null;
	client.token = null;
	
	client.testMode = false;
	
	client.on('testRoom', function(data) {
		console.log("****");
		console.log(data);
		console.log(ClientManager.GetClientsInRoom(data));
		console.log("XXXX");
	});
	
	EventManager.RegisterEvents(client);
	
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
		if (client.username)
			console.log(client.username + " left !");
		else
			console.log('Un-Auth user left !');
		client.username = null;
		if (client.room) {
			client.leave(client.room);
		}
		client.room = null;
		client.password = null;
		client.token = null;
	});
});

var port = config.SERVER_PORT;

if (process.argv.length > 2) {
	try {
		port = parseInt(process.argv[2]);
	} catch (e) {
		
	}
}

console.log('Server listening on ' + port + ' !');

server.listen(port);