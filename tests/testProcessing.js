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
		this.catTested++;
		this.catCleared++;
		this.printProgress(this.catTested, this.catCleared, true);
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
		this.catTested++;
		this.printProgress(this.catTested, this.catCleared, true);
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
	printProgress: function(current, success, processing = false, resumeAll = false) {
		var max_count = testList.TESTS[this.cats[this.cat]].length;
		if (resumeAll)
			max_count = this.testCount;
		var dot_count = max_count / 10;
		if (resumeAll)
			dot_count = max_count / 20;
		
		var colored_dots = 0;
		var uncolored_dots = 10;
		var tmp_success = success;
	
		while (tmp_success >= dot_count) {
			tmp_success -= dot_count;
			colored_dots++;
			uncolored_dots--;
		}
	
		readline.cursorTo(process.stdout, 0); // Clearing old progress
		if (resumeAll)
			process.stdout.write(' [');
		else
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
	testCount: 0,
	cleared: 0,
	tested: 0,
	cats: [],
	cat: 0,
	catTested: 0,
	catCleared: 0,
	timeoutChecker: null,
	finishCallback: null,
	
	// Initialize test process
	test: function(socket, callback = null) {
		this.testCount = 0;
		var tmp = 0;
		for (var i in testList.TESTS) {
			this.cats[tmp] = i;
			this.testCount += testList.TESTS[i].length;
			tmp++;
		}
		console.log(this.testCount.toString().green.bold + ' test(s) found !'.bold);
		this.cleared = 0;
		this.tested = 0;
		this.cat = 0;
		this.catTested = 0;
		this.catCleared = 0;
		this.finishCallback = callback;
		console.log(this.cats[this.cat].bold.cyan);
		this.nextTest(socket);
	},
	
	// launch next test
	nextTest: function(socket) {
		if (this.tested >= this.testCount) {
			this.printProgress(this.catTested, this.catCleared, false);
			socket.close();
			console.log('Test(s) runned successfuly!');
			console.log('Total: ' + this.testCount.toString().bold.green);
			if (this.cleared == this.testCount) {
				console.log('Passed: ' + this.cleared.toString().bold.green);
			} else if (this.cleared <= this.testCount / 2) {
				console.log('Passed: ' + this.cleared.toString().bold.red);
			} else {
				console.log('Passed: ' + this.cleared.toString().bold.yellow);
			}
			this.printProgress(this.tested, this.cleared, false, true);
			if (this.finishCallback != null) {
				this.finishCallback();
			}
		} else if (this.catTested >= testList.TESTS[this.cats[this.cat]].length) {
			this.cat++;
			this.catTested = 0;
			this.catCleared = 0;
			console.log('');
			console.log(this.cats[this.cat].bold.cyan);
			this.nextTest(socket);
		} else {
			socket.emit('resetSocket');
			this.executeTest(this.catTested, socket);
		}
	},
	
	// execute test
	executeTest: function(id, socket) {
		this.printProgress(this.catTested, this.catCleared, true);
		if (this.timeoutChecker != null) {
			clearTimeout(this.timeoutChecker);
			this.timeoutChecker = null;
		}
		this.timeoutChecker = setTimeout(function() {this.timedoutTest(socket);}.bind(this, socket), config.TEST_TIMEOUT);
		testList.TESTS[this.cats[this.cat]][id](socket);
	}
}
