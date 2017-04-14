client.controller('MainController', ['$scope', function($scope) {
	$scope.courses_old = [
		{
			name: 'Math I',
			description: 'Taught by Nguyen Canh Nam'
		},
		{
			name: 'Physic I',
			description: 'Taught by Le Tuan'
		}
	];
	// $scope.course = api.success(function(data){
	// 	$scope.data = data;
	// })
}]);
