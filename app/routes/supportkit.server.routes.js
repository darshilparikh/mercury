

'use strict';


var http = require('http');
var request = require('request');
module.exports = function(app) {
	var appID = '55fcf13cb16704190059ad34';
	var appToken = '3nk9czd4dirwzud276brpiuse';
	var JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjU1ZmRjMjJkYjE2NzA0MTkwMDU5YWQ1NiJ9.eyJzY29wZSI6ImFwcCIsImlhdCI6MTQ0MjY5Mzc4M30.wSgavSXoJq8TUdLthI8aIlY1Nq55SG7f1br96EO9fhQ";
	var secretKey = "";

	var skHost = 'https://supportkit-thenorth.herokuapp.com';
	var webHooks = '/api/apps/' + appID + '/webhooks';
	var ngrok = "http://0b62376d.ngrok.io/supportkit";
	var postMessagePre = "/api/appusers/";
	var postMessagePost = "/conversation/messages";

	var onGoingChats = [];
	var freeMentors = [];
	var waitingList = [];

	var openConnections = [];

	function sendMessage(senderName, appUserId, id, messageText) {
		// /api/appusers/{appUserId|userId}/conversation/messages
		var options = {
			url: skHost + postMessagePre + appUserId + postMessagePost,
			headers: {
				'app-token' : '3nk9czd4dirwzud276brpiuse',
				'Authorization' : 'Bearer ' + JWT
			},
			form: {
				text : messageText,
				authorId : id,
				name : senderName,
				role : 'appMaker'
			}
		};
		
		request.post(options, function optionalCallback(err, httpResponse, body) {
			if (err) {
				return console.error('upload failed:', err);
			}
			console.log('Upload successful!  Server responded with:', body);
		});
	}

	function generateUUID(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	function ifOnGoingChat(appUserId) {
		for(var x = 0; x < onGoingChats.length; x++) {
			if(onGoingChats[x]["appUserId"] == appUserId) {
				return true;
			}
		}
		return false;
	}

	function assignMentor(appUserId, isStudent, message) {
		if(! isStudent) {
			if(waitingList.length > 0) {
				onGoingChats.push({
					"mentor" : freeMentors[0],
					"appUserId" : waitingList[0]
				});

				sendMessage("System", waitingList[0], waitingList[0], "You've been matched! Say hello to " + freeMentors[0].name);

				waitingList.shift();
				freeMentors.shift();
				for(var x = 0; x < waitingList.length; x++) {
					var spotInLine = x + 1;
					sendMessage("System", waitingList[x], waitingList[x], "You've moved up in line! You're now #" + spotInLine + " in line. Thanks for waiting!");
				}
			}
		} else {

			if(freeMentors.length >= 1) {
				onGoingChats.push({
					"mentor" : freeMentors[0],
					"appUserId" : appUserId
				});
				sendMessage("System", appUserId, appUserId, "You've been matched! Say hello to " + freeMentors[0].name);
				sendMessage(freeMentors[0].name, appUserId, appUserId, message);
				freeMentors.shift();

			} else {
				console.log("Telling");
				console.log(waitingList);
				if(waitingList.indexOf(appUserId) == -1) {
					waitingList.push(appUserId);
				}
				console.log(waitingList);
				var spotInLine = waitingList.indexOf(appUserId) + 1;
				sendMessage("System", appUserId, appUserId, "Sorry! No mentors are free right now, but don't worry! You're #" + spotInLine + " on the wait list to talk to someone.");
			}

		}
	}

	app.post('/supportkit/mentor/init', function (req, res, next) { 
		console.log("Heloo Support");
		var mentorID = generateUUID();
		var mentorName = req.name;
		freeMentors.push({"id" : mentorID, "name" : mentorName });
		assignMentor("", false);
		res.send();
	});

	app.post('/supportkit', function (req, res, next) {
		var appUserId = req.body.appUserId;
		if(secretKey != req.headers["x-api-key"]) {
			res.send();
		}
		console.log('supportkit');
		console.log(req.body);
		console.log(req.headers);

		if(req.body.event === 'message:appUser') {
			if(ifOnGoingChat(appUserId)) {
				global.io.sockets.emit(appUserId, { name: req.body.name, text : req.body.text });
			} else {
				assignMentor(appUserId, true, req.body);
			}
		}
		res.send();
		//next();
	});

	function createWebHook(targetURL) {
		var options = {
			url: skHost + webHooks,
			headers: {
				'app-token' : '3nk9czd4dirwzud276brpiuse',
				'Authorization' : 'Bearer ' + JWT
			},
			form: {
				target : targetURL
			}
		};
		request.post(options);
		console.log("Created Web Hook");
	}

	function deleteWebHook(_id) {
		var options = {
			url: skHost + webHooks + "/" + _id,
			headers: {
				'app-token' : '3nk9czd4dirwzud276brpiuse',
				'Authorization' : 'Bearer ' + JWT
			}
		};
		request.del(options);
		console.log("Deleting " + _id);
	}

	function checkWebHooks() {
		var options = {
			url: skHost + webHooks,
			headers: {
				'app-token' : '3nk9czd4dirwzud276brpiuse',
				'Authorization' : 'Bearer ' + JWT
			}
		};
		request(options, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				console.log(response.body);
				var allWebHooks = JSON.parse(response.body);
				if(allWebHooks.length > 1 ) {
					secretKey = allWebHooks[0].secret;
					for(var x = 1; x < allWebHooks.length; x++) {
						deleteWebHook(allWebHooks[x]._id);
					}
				} else if (allWebHooks.length === 1) {
					secretKey = allWebHooks[0].secret;
				} else if (allWebHooks.length === 0) {
					createWebHook(ngrok);
				}
			}
		});

	}

	checkWebHooks();
	

	

	app.get('/supportkit/mentor/message', function (req, res) {
		console.log("SOCKET IO BRUJ! YOOoOoooooooooooooooooooooooooooooo");
		console.log(global.io);
		console.log('supportkit');
		console.log(req.body);
		console.log(req.headers);

		req.socket.setTimeout(Infinity);
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		res.write('\n');
		openConnections.push(res);
		req.on("close", function() {
			var toRemove;
			for (var j =0 ; j < openConnections.length ; j++) {
				if (openConnections[j] == res) {
					toRemove =j;
					break;
				}
			}
			openConnections.splice(j,1);
		});


		//next();
	});
};
