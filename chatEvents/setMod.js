const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');
const https = require('https');
const config = require('../config');

module.exports = {
	RegisterEvent: function(client) {
		client.on('setMod', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client setMod error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.SetModProperties, events.SET_MOD_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'DelMod syntax error !'});
				console.log("Client setMod error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToSetMod = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToSetMod = rclient;
                    }
                });
                if (clientToSetMod != null) {
                    // SET MOD HERE
					
					// Request API
					var options = {
                        host: config.API_URL,
                        path: '/streams/' + client.room + '/rights/' + clientToSetMod.uid,
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                    };
					
					var req = https.request(options, function(e) {
                        var str = '';
                        console.log('request setmod to API');
                        console.log('statusCode:', e.statusCode);
                        console.log('headers:', e.headers);
                        e.on('data', (chunck) => {console.log('Response: ' + chunck);str += chunck;});
                        e.on('end', () => {
                            console.log(str);
                            console.log(clientToSetMod.username + ' is now Mod');
				            clientToSetMod.rank = config.RIGHTS.MOD;
                            clientToSetMod.emit('setMod', {});
                            client.emit('setMod', {'message': 'Success', 'reason': clientToSetMod.username + ' is now Mod'});
                        });
                        e.on('error', (err) => {console.log(err);});
                    });
					
					var setmod_data = {};
				    setmod_data['rightId'] = 10;
				    var r_a = JSON.stringify(setmod_data);
                    console.log(r_a);
				    req.write(r_a);
				    req.end();
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'SetMod error (user not found) !'});
                    console.log('Client SetMod error ! (user not found)');
                }
			}
		});
	}
}
