angular.module('webix')

    .controller('forgotController',function ($scope, $http, $window, $timeout, $rootScope) {
        $scope.errorMessage = "";
        $scope.doForgot = function () {
            $http({
                method: 'POST',
                url: $rootScope.apiUrl+"/requestResetsPassword",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    email: $scope.email
                }
            }).success(function (response) {
                if(response['result'] === false) {
                    $scope.errorMessage = response['message'];
                } else {
                    $window.location = response['link'];
                }
            }).error(function () {

            })
        };

    });
