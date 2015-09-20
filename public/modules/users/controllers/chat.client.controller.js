'use strict';

<<<<<<< HEAD
angular.module('users').controller('ChatController', ['$scope','$http', 'Socket', 
	function($scope, $http, Socket) {
		
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
             
            Socket.emit('mentorinit', {
                data: objToSend
                }, function (result) {
                if (!result) {
                        alert('There was an error changing your name');
                } else {
                
                       alert(result);
                }});
         };
        
        
        
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
        
        //alert(io);
        //alert(JSON.stringify(io));

        Socket.on('connect', function(article) {
                console.log(article);
        });
               
               
        
        
        

        $scope.addBubble = function(avatar, text) {
=======
angular.module('users').controller('ChatController', ['$scope','$http', function($scope, $http) {
  var bubbles = 1;
  var maxBubbles = 8;
  var server;
  $scope.msg = "";
  var user = "Mike";
  var customerid = "123";
  $scope.messages = [];

  $scope.avatar_urlSelf = '/modules/users/img/identicons/Unknown-2.png';
  $scope.avatar_urlOther = '/modules/users/img/identicons/Unknown-3.png';

  $scope.sendMessage = function (msg) {
   var objToSend = { "name" : user, "id" : customerid, "text" : msg };

   $scope.messages.push({ "msg" : msg, "sender" : "mentor"});
   $scope.msg = "";
   $http.post('/supportkit/mentor/sendmessege', objToSend)
   .then(function(response) {
    console.log (JSON.stringify(response));

  }, function(response) {
    console.log("Some sort of error with response");
  });
 }
 $scope.getMessages = function () {
  var objToSend = {"id" : customerid};
  $http.post('/supportkit/mentor/getmsgs', objToSend)
  .then(function(response) {
    console.log (JSON.stringify(response));
    if(response.data.length > 0) {
      for(var x = 0; x < response.data.length; x++) {
        $scope.messages.push({ "msg" : response.data[x], "sender" : "student"});
      }
    }
    setTimeout(function () {
      $scope.getMessages();
    }, 500);
  }, function(response) {
    console.log("Some sort of error with response");
  });
}

$scope.initMentor = function () {
 var objToSend = { "name" : user };
 $http.post('/supportkit/mentor/init', objToSend)
 .then(function(response) {
  console.log (JSON.stringify(response));
  customerid = response.data.id;
  console.log(customerid);
  $scope.getMessages();

}, function(response) {
  console.log("Some sort of error with response");
});

}

$scope.initMentor();


$scope.addBubble = function(avatar, text) {
>>>>>>> half-second-refresh

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


        }]);