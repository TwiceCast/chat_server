module.exports = {
	InvalidSyntaxException: function(message) {
		this.message = message;
		this.name = 'InvalidSyntaxException';
	},
	InvalidArgumentException: function(message) {
		this.message = message;
		this.name = 'InvalidArgumentException';
	}
}