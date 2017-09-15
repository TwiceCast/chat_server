module.exports = {
	
	clients: [],
  
	AddClient: function(socket) {
		if (socket in this.clients) {
			return false;
		} else {
			this.clients.push(socket);
			return true;
		}
	},
	
	GetClientsInRoom: function(room) {
		var res = [];
		this.clients.forEach(function(elem) {
			if (elem.room == room) {
				res.push(elem);
			}
		});
		
		return res;
	}

}
