angular.module('webix')

    .controller('signupController',function ($rootScope, $scope, $state, auth, user, $http) {
        $scope.userModal = {};
        $scope.successSignup = false;
        $scope.errorMessage = "";
        $scope.disbaleSigup = false;

        $scope.signup = function () {
            $scope.disbaleSigup = true;
            $http({
                method: 'POST',
                url: $rootScope.apiUrl + '/signUp',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    username: $scope.userModal.username,
                    name: $scope.userModal.name,
                    email: $scope.userModal.email,
                    password: $scope.userModal.password,
                    rePassword: $scope.userModal.rePassword
                }
            }).success(function (response) {
                if (response['result'] === false){
                    $scope.errorMessage = response['message']
                } else {
                    $scope.successSignup = true;
                }
                $scope.disbaleSigup = false;
            }).error(function (response) {
                $scope.disbaleSigup = false;
            })
        };
    });
