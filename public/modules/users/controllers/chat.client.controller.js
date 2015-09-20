'use strict';

angular.module('users').controller('ChatController', ['$scope','$http', function($scope, $http) {
  var bubbles = 1;
  var maxBubbles = 8;
  var server;

  var user = "Mike";
  var customerid = "123";

  $scope.avatar_urlSelf = '/modules/users/img/identicons/Unknown-2.png';
  $scope.avatar_urlOther = '/modules/users/img/identicons/Unknown-3.png';

  $scope.sendMessage = function (msg) {
   console.log("Messege sent = " + msg);
   var objToSend = { "name" : user, "id" : customerid, "text" : msg };

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
        setTimeout(function () {
            $scope.getMessages();
        }, 500);
    }, function(response) {
        console.log("Some sort of error with response");
    });
}

$scope.getMessages();



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

        
    }]);