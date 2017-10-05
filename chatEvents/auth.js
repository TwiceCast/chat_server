const https = require('https');
const config = require('../config');
const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');

module.exports = {
	RegisterEvent: function(client) {
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
				var options = {
					host: config.API_URL,
					path: '/login',
					method: 'POST',
					headers: {'Content-Type': 'application/json'}
				};
			
				var callback = function(response) {
					var str = '';
					response.on('data', function (chunk) {
						str += chunk;
					});
				
					response.on('end', function () {
						try
						{
							var response = JSON.parse(str);
							if (response['token'])
							{
								client.username = data.username;
								client.password = data.password;
								client.room = data.room;
								client.token = response['token'];
								client.join(client.room, function() {
									if (ClientManager.AddClient(client, client.room)) {
										client.emit('auth', {'code': 200, 'message': 'Authentification complete', 'accessLevel': config.RIGHTS.ADMIN});
										console.log("Client (" + client.username + ") Joined #" + client.room + "!");
									} else {
										client.emit('cerror', {'code': 401, 'message': 'Authentification failed'});
										console.log("Client (" + client.username + ") Client Manager Failed!");
									}
								});
							}
							else
							{
								console.log(response);
								client.emit('cerror', {'code': 401, 'message': 'Authentification failed'});
							}
						}
						catch (e)
						{
							client.emit('cerror', {'code': 401, 'message': 'Authentification failed'});
							console.log(e.message);
						}
					});
				}
			
				var req = https.request(options, callback);
				var auth_data = {};
				auth_data['email'] = data.username;
				auth_data['password'] = data.password;
				console.log("auth");
				var r_a = JSON.stringify(auth_data);
				console.log(r_a);
				req.write(r_a);
				req.end();
			}
		});
	}
}
