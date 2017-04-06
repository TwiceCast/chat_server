var server = require('http').createServer();
var io = require('socket.io')(server);

var utils = require('./utils');
var exceptions = require('./exceptions');
var events = require('./events');

var TEST_MODE_ENABLE = true;

io.on('connection', function(client) {
	console.log("New connection !");
	
	client.username = null;
	client.password = null;
	client.room = null;
	
	client.testMode = false;
	
	client.on('resetSocket', function() {
		if (!client.testMode) {
			client.emit('cerror', {'code': 403, 'message': 'Client not in test mode'});
			console.log('resetSocket error !');
		} else {
			client.username = null;
			if (client.room) {
				client.leave(client.room);
			}
			client.room = null;
			client.password = null;
			console.log('socket reset !');
		}
	});
	
	client.on('setTestMode', function(data) {
		if (!utils.hasProperties(data, events.SetTestModeProperties, events.SET_TEST_MODE_STRICT) == true) {
			client.emit('cerror', {'code': 400, 'message': 'SetTestMode syntax error'});
			console.log('setTestMode failed');
		}
		else if (!TEST_MODE_ENABLE) {
			client.emit('cerror', {'code': 403, 'message': 'Test mode not permitted by server'});
			console.log('setTestMode failed (Not permitted)');
		}
		else {
			client.testMode = data.value;
			console.log('Test mode switch ! (' + data.value + ')');
		}
	});
	
	client.on('auth', function(data) {
		if (!utils.hasProperties(data, events.AuthProperties, events.AUTH_STRICT)) {
			client.emit('cerror', {'code': 400, 'message': 'Authentification syntax error'});
			console.log("Client authentification error ! (Properties)");
		}
		else if (utils.isAuth(client)) {
			client.emit('cerror', {'code': 403, 'message': 'Already logged in !'});
			console.log("Client (" + client.username + ") already auth !")
		}
		else if (data.room == "") {
			client.emit('cerror', {'code': 400, 'message': 'Authentification error: Missing room'});
		}
		else if (data.username == "") {
			client.emit('cerror', {'code': 400, 'message': 'Authentification error: Missing username'});
		}
		else if (data.password == "") {
			client.emit('cerror', {'code': 400, 'message': 'Authentification error: Missing password'});
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
	});
});

var port = 3005;

if (process.argv.length > 2) {
	try {
		port = parseInt(process.argv[2]);
	} catch (e) {
		
	}
}

console.log('Server listening on ' + port + ' !');

server.listen(port);