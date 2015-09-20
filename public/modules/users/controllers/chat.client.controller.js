'use strict';

angular.module('users').controller('ChatController', ['$scope','$http',
	function($scope, $http) {
		
		var bubbles = 1;
        var maxBubbles = 8;
        var server;
        
        var user = "Mike";
        var customerid = "123";

        $scope.avatar_urlSelf = '/modules/users/img/identicons/Unknown-2.png';
        $scope.avatar_urlOther = '/modules/users/img/identicons/Unknown-3.png';
        
         $scope.sendMessage = function(msg) {
             alert("Messege sent = " + msg);
             var objToSend = 
                {
                    "name" : user,
                    "id" : customerid,
                    "text" : msg
                }
             
            $http.post('/supportkit/mentormessege', objToSend).
            then(function(response) {
                alert (JSON.stringify(alert));
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("Some sort of error with response");
            });
        }
        
        
        function statCtrl($scope) {
        
                // the last received msg
                $scope.msg = {};
                
                // handles the callback from the received event
                var handleCallback = function (msg) {
                        alert(JSON.stringify(msg));
                        $scope.$apply(function () {
                                $scope.msg = JSON.parse(msg.data)
                        });
                }
                
                var source = new EventSource('/supportkit/mentor/message');
                source.addEventListener('message', handleCallback, false);
        }
        
        var socket = io.connect('http://localhost:3000');
                socket.on('news', function (data) {
                console.log(data);
                socket.emit('my other event', { my: 'data' });
        });
        
        
        

        $scope.addBubble = function(avatar, text) {

            // Get the bytes of the image and convert it to a BASE64 encoded string and then
            // we use data URI to add dynamically the image data
            var avatarUri = "data:image/png;base64," + avatar.toBase64();

            var bubble = $('<div class="bubble-container"><span class="bubble"><img class="bubble-avatar" src="' + avatarUri + '" /><div class="bubble-text"><p>' + text + '</p></div><span class="bubble-quote" /></span></div>');
            $("#msgText").val("");

            $(".bubble-container:last")
                .after(bubble);

            if (bubbles >= maxBubbles) {
                var first = $(".bubble-container:first")
                    .remove();
                bubbles--;
            }

            bubbles++;
            $('.bubble-container').show(250, function showNext() {
                if (!($(this).is(":visible"))) {
                    bubbles++;
                }

                $(this).next(".bubble-container")
                    .show(250, showNext);

                $("#wrapper").scrollTop(9999999);
            });
        }

        
	}
        
     
]);