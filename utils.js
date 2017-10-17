var exceptions = require('./exceptions');
const config = require('./config');

module.exports = {
	isArray: function(data) {
		return data.constructor === Array;
	},
	isAuth: function(client) {
		if (!client)
			throw new exceptions.InvalidArgumentException('Client cannot be null !');
		if (!this.hasProperties(client, ['username', 'password', 'room'], false))
			throw new exceptions.InvalidArgumentException('Client\'s properties missing !');
		return client.username && client.password && client.room && client.token && client.chatToken && client.displayedName && client.uid != -1 && client.rank != config.RIGHTS.UNKNOW;
	},
	AuthentificationRequired: function (client) {
		client.emit('cerror', {'code': 401, 'message': 'Authentification required'});
	},
	hasProperties: function(toCheck, requiredProperties, isStrict = false) {
		if (!this.isArray(requiredProperties)) {
			throw new exceptions.InvalidSyntaxException('requiredProperties must be an array of string !');
		}
	
		for (var i in requiredProperties) {
			if (!toCheck.hasOwnProperty(requiredProperties[i])) {
				console.log('missing property: ' + requiredProperties[i]);
				return false;
			}
		}
	
		if (isStrict) {
			var propertyCount = 0;
			for (var property in toCheck) {
				if (toCheck.hasOwnProperty(property)) {
					propertyCount++;
				}
			}
		
			if (requiredProperties.length != propertyCount)
				return false;
		}
		
		return true;
	}
}
