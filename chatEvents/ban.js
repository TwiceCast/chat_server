const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');
const https = require('https');
const config = require('../config');

module.exports = {
	RegisterEvent: function(client) {
		client.on('ban', function(data) {
			if (!utils.isAuth(client)) {
				utils.AuthentificationRequired(client);
				console.log("Client ban error ! (Authentification)");
			}
			else if (!utils.hasProperties(data, events.BanProperties, events.BAN_STRICT)) {
				client.emit('cerror', {'code': 400, 'message': 'Ban syntax error !'});
				console.log("Client ban error ! (Properties)");
			}
			else
			{
				var clientsInRoom = ClientManager.GetClientsInRoom(client.room);
                var clientToBan = null;
                clientsInRoom.forEach(function(rclient) {
                    if (rclient.username == data.username) {
                        clientToBan = rclient;
                    }
                });
                if (clientToBan != null) {
                    console.log('Banning...' + clientToBan.username);
                    var uidToBan = clientToBan.uid;
                    clientToBan.emit('ban', {'message': 'Disconnected', 'reason':'You have been banned !'});
                    client.emit('ban', {'message': 'Success', 'reason': data.username + ' has been banned'});
                    clientToBan.disconnect(true);

                    var options = {
                        host: config.API_URL,
                        path: '/streams/' + clientToMute.room + '/chat/ban',
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                    };

                    var req = https.request(options, function(e) {
                        var str = '';
                        console.log('request ban to API');
                        console.log('statusCode:', e.statusCode);
                        console.log('headers:', e.headers);
                        e.on('data', (chunck) => {console.log('Response: ' + chunck);str += chunck;});
                        e.on('end', () => {console.log(str);});
                        e.on('error', (err) => {console.log(err);});
                    });
				    var ban_data = {};
				    ban_data['id'] = uidToBan;
				    ban_data['duration'] = 500;
				    var r_a = JSON.stringify(ban_data);
                    console.log(r_a);
				    req.write(r_a);
				    req.end();
                } else {
                    client.emit('cerror', {'code': 400, 'message': 'Ban error (user not found) !'});
                    console.log('Client ban error ! (user not found)');
                }
			}
		});
	}
}
