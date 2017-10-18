const https = require('https');
const config = require('../config');
const utils = require('../utils');
const events = require('../events');
const ClientManager = require('../ClientManager');
var JWT = require('jsonwebtoken');
const colors = require('colors');

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
                                var decoded = JWT.decode(response['token'], {complete: true});
                                console.log('---------'.cyan);
                                console.log(decoded);
                                console.log('---------'.cyan);
								client.username = data.username;
								client.password = data.password;
								client.room = data.room;
								client.token = response['token'];
                                client.uid = decoded.payload.uid;

                                var options2 = {
                                    host: config.API_URL,
                                    path: '/streams/' + client.room + '/chat',
                                    method: 'GET',
                                    headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                                };

                                var callback2 = function(response2) {
                                    var str2 = '';
                                    response2.on('data', function (chunk) {
                                        str2 += chunk;
                                    });

                                    response2.on('end', function () {
                                        var response2 = JSON.parse(str2);
                                        if (response2['token']) {
                                            client.chatToken = response2['token'];
                                            var decodedChat = JWT.decode(response2['token'], {complete: true});
                                            console.log(decodedChat);
                                            client.displayedName = decodedChat.payload.username;
                                            client.rank = config.RIGHTS.USER;
                                            for (var tmp_rank of decodedChat.payload.rights) {
                                                var tmp_irank = parseInt(tmp_rank);
                                                var tmp_nrank = config.RANKS[tmp_irank].right;
                                                if (tmp_nrank < client.rank && tmp_nrank != config.RIGHTS.UNKNOW) {
                                                    client.rank = tmp_nrank;
                                                }
                                            }

                                            var options3 = {
                                                host: config.API_URL,
                                                path: '/streams/' + client.room + '/chat/ban/' + client.uid,
                                                method: 'GET',
                                                headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                                            }

                                            var callback3 = function(response3) {
                                                var str3 = '';
                                                response3.on('data', function(chunck) {
                                                    str3 += chunck;
                                                });

                                                response3.on('end', function() {
                                                    var response3 = JSON.parse(str3);
                                                    var isBanned = false;
                                                    if (response3.length > 0) {
                                                        for (var ban_data of response3) {
                                                            var endBanDate = new Date(Date.parse(ban_data['end']));
                                                            var timeNow = new Date();
                                                            var rendBanDate = endBanDate.getTime() + (0 * 60000); // Correcting server time (temporary)
                                                            var rtimeNow = timeNow.getTime() + (timeNow.getTimezoneOffset() * 60000); // correcting local time
                                                            if (rendBanDate > rtimeNow) {
                                                                client.emit('ban', {'message': 'Disconnected', 'reason':'You have been banned !'});
                                                                client.disconnect(true);
                                                                isBanned = true;
                                                            }
                                                        }
                                                    }
                                                    // Client is not banned
                                                    if (isBanned == false) {
                                                        var options4 = {
                                                            host: config.API_URL,
                                                            path: '/streams/' + client.room + '/chat/mute/' + client.uid,
                                                            method: 'GET',
                                                            headers: {'Content-Type': 'application/json', 'Authorization': client.token}
                                                        }

                                                        var callback4 = function(response4) {
                                                            var str4 = '';
                                                            response4.on('data', function(chunck) {
                                                                str4 += chunck;
                                                            });

                                                            response4.on('end', function() {
                                                                var response4 = JSON.parse(str4);
                                                                if (response4.length > 0) {
                                                                    for (var mute_data of response4) {
                                                                        var endDate = new Date(Date.parse(mute_data['end']));
                                                                        var timeNow = new Date();
                                                                        var rendDate = endDate.getTime() + (0 * 60000); // Correcting server time (temporary)
                                                                        var rtimeNow = timeNow.getTime() + (timeNow.getTimezoneOffset() * 60000); // (correcting local time)
                                                                        console.log(rendDate);
                                                                        console.log(rtimeNow);
                                                                        if (rendDate > rtimeNow) {
                                                                            var duration = rendDate - rtimeNow;
                                                                            client.isMuted = true;
                                                                            client.muteDate = Date.now();
                                                                            client.muteDuration = Math.floor(+duration / 1000);
                                                                        }
                                                                    }
                                                                    if (client.isMuted) {
                                                                        client.emit('mute', {'duration': client.muteDuration});
                                                                    }
                                                                }

                                                                client.join(client.room, function() {
                                                                    if (ClientManager.AddClient(client, client.room)) {
                                                                        client.emit('auth', {'code': 200, 'message': 'Authentification complete', 'accessLevel': client.rank});
                                                                        console.log("Client (" + client.username + ") Joined #" + client.room + "!");
                                                                    } else {
                                                                        client.emit('cerror', {'code': 401, 'message': 'Authentification failed'});
                                                                        console.log("Client (" + client.username + ") Client Manager Failed!");
                                                                    }
                                                                });
                                                            });
                                                        }

                                                        var req4 = https.request(options4, callback4);
                                                        req4.end();
                                                    }
                                                });
                                            }

                                            var req3 = https.request(options3, callback3);
                                            req3.end();
                                        } else {
                                            console.log(response2);
                                            client.emit('cerror', {'code': 401, 'message': 'Authentification failed'});
                                        }
                                    });
                                }

                                var req2 = https.request(options2, callback2);
                                req2.end();
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
