const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');
const https = require('https');
const config = require('../config');

module.exports = {
	RegisterEvent: function(client) {
		client.on('delMod', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client delMod error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.DelModProperties, events.DEL_MOD_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'DelMod syntax error !'});
				console.log("Client delMod error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToDelMod = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToDelMod = rclient;
                    }
                });
                if (clientToDelMod != null) {
                    // DEL MOD HERE
					
					// Request API
					var options = {
                        host: config.API_URL,
                        path: '/streams/' + client.room + '/rights/' + clientToDelMod.uid,
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                    };
					
					var req = https.request(options, function(e) {
                        var str = '';
                        console.log('request delmod to API');
                        console.log('statusCode:', e.statusCode);
                        console.log('headers:', e.headers);
                        e.on('data', (chunck) => {console.log('Response: ' + chunck);str += chunck;});
                        e.on('end', () => {
                            console.log(str);
                            console.log(clientToDelMod.username + ' is not Mod anymore');
							clientToDelMod.rank = config.RIGHTS.USER;
							clientToDelMod.emit('delMod', {});
							client.emit('delMod', {'message': 'Success', 'reason': clientToDelMod.username + ' is not Mod anymore'});
                        });
                        e.on('error', (err) => {console.log(err);});
                    });
					
					var delmod_data = {};
				    delmod_data['right'] = 10;
				    var r_a = JSON.stringify(delmod_data);
                    console.log(r_a);
				    req.write(r_a);
				    req.end();
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'DelMod error (user not found) !'});
                    console.log('Client DelMod error ! (user not found)');
                }
			}
		});
	}
}
