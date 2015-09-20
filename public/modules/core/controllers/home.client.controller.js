'use strict';


angular.module('core').controller('HomeController', ['$http', '$scope', 'Authentication',
	function($http, $scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.id = '';
		$scope.mentorName = '';
		$scope.testFn = function() {
			$http.post("/supportkit/mentor/init", { name : $scope.mentorName })
			.then(function(response) {
				console.log("Good");
				console.log(response);
			}, function(err) {
				console.log("Bad");
				console.log(err);
			});
		}
	}
]);