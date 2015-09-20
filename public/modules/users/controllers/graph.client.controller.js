'use strict';



angular.module('users').controller('GraphController', ['$scope', '$http',
	function($scope, $http) {

		var chart = new CanvasJS.Chart("myChart",
			{
				axisX:{ 
			   title: "Time",
				},
				axisY:{ 
				   title: "Sentiment",
				},
				animationEnabled: true,
				title:{
					text: "Conversation Analysis"
				},
				data: [
				{
					type: "spline", //change type to bar, line, area, pie, etc
					showInLegend: true,        
					dataPoints: []
					}
				],
				legend: {
					cursor: "pointer",
					itemclick: function (e) {
						if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
							e.dataSeries.visible = false;
						} else {
							e.dataSeries.visible = true;
					}
					chart.render();
					}
				}
			});
		//console.log(chart)

		var getPoints = function(callback, chart){
			console.log(chart)

			 $http.get('/graph', {msg:'hello world!'}).
				  then(function(response) {
						//console.log(response.data[0].log.item);
				  	editResponse(response.data, callback, chart);
				    
				  }, function(response) {
				    console.log(response);
			  });
		};

		var editResponse = function(array, callback, chart){
			console.log('in editResponse, chart is: ');
			console.log(chart)
			//console.log(array);
			var result = []; 

			for (var i = 0; i < array.length; i++) {
				var xy = {};
				var time = new Date(array[i].log.item.timestamp);
				xy.x = time;
				var sentiment = array[i].log.item.sentiment;
				xy.y = sentiment;
				result.push(xy);
			};
			console.log(result);
			chart.options.data[0].dataPoints = result;
			callback();
		}
		
		getPoints(chart.render,chart);

//end of scope function
  }
]);
//window.onload = function () {
	
//}