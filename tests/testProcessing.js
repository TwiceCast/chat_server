/*
** DO NOT TOUCH !!
** Module requirements
*/
var config = require('./config.js');
var colors = require('colors');
var readline = require('readline');
var testList = require('./TESTS');

module.exports = {
	/*
	** Launch next test(must be called by valid runned tests)
	*/
	validateTest: function(socket) {
		if (this.timeoutChecker != null) {
			clearTimeout(this.timeoutChecker);
			this.timeoutChecker = null;
		}
		this.cleared++;
		this.tested++;
		this.printProgress(this.tested, this.cleared, true);
		this.nextTest(socket);
	},
	
	/*
	** Launch next test(must be called by unvalid runned tests)
	*/
	unvalidateTest: function(socket) {
		if (this.timeoutChecker != null) {
			clearTimeout(this.timeoutChecker);
			this.timeoutChecker = null;
		}
		this.tested++;
		this.printProgress(this.tested, this.cleared, true);
		this.nextTest(socket);
	},
	
	timedoutTest: function(socket) {
		this.timeoutChecker = null;
		this.tested++;
		this.printProgress(this.tested, this.cleared, true);
		this.nextTest(socket);
	},
	
	/*
	** Displays testing progression
	*/
	printProgress: function(current, success, processing = false) {
		var max_count = testList.TESTS.length;
		var dot_count = max_count / 10;
	
		var colored_dots = 0;
		var uncolored_dots = 10;
		var tmp_success = success;
	
		while (tmp_success >= dot_count) {
			tmp_success -= dot_count;
			colored_dots++;
			uncolored_dots--;
		}
	
		readline.cursorTo(process.stdout, 0); // Clearing old progress
		process.stdout.write('Testing...[');
		while (colored_dots > 0) {
			process.stdout.write(' '.bgGreen);
			colored_dots--;
		}
		while (uncolored_dots > 0) {
			if (processing)
				process.stdout.write(' '.bgYellow);
			else
				process.stdout.write(' '.bgRed);
			uncolored_dots--;
		}
		process.stdout.write('] ' + current + '(' + success.toString().green + ')/' + max_count);
		if (!processing)
			console.log('');
	},
	
	/*
	** DO NOT TOUCH BELOW !!
	** Test processing logic
	*/
	cleared: 0,
	tested: 0,
	timeoutChecker: null,
	finishCallback: null,
	
	// Initialize test process
	test: function(socket, callback = null) {
		console.log(testList.TESTS.length.toString().green.bold + ' test(s) found !'.bold);
		this.cleared = 0;
		this.tested = 0;
		this.finishCallback = callback;
		this.nextTest(socket);
	},
	
	// launch next test
	nextTest: function(socket) {
		if (this.tested >= testList.TESTS.length) {
			this.printProgress(this.tested, this.cleared, false);
			socket.close();
			console.log('Test(s) runned successfuly!');
			console.log('Total: ' + testList.TESTS.length.toString().bold.green);
			if (this.cleared == testList.TESTS.length) {
				console.log('Passed: ' + this.cleared.toString().bold.green);
			} else if (this.cleared <= testList.TESTS.length / 2) {
				console.log('Passed: ' + this.cleared.toString().bold.red);
			} else {
				console.log('Passed: ' + this.cleared.toString().bold.yellow);
			}
			if (this.finishCallback != null) {
				this.finishCallback();
			}
		} else {
			this.executeTest(this.tested, socket);
		}
	},
	
	// execute test
	executeTest: function(id, socket) {
		this.printProgress(this.tested, this.cleared, true);
		if (this.timeoutChecker != null) {
			clearTimeout(this.timeoutChecker);
			this.timeoutChecker = null;
		}
		this.timeoutChecker = setTimeout(function() {this.timedoutTest(socket);}.bind(this, socket), config.TEST_TIMEOUT);
		testList.TESTS[id](socket);
	}
}
