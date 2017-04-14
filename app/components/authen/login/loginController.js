angular.module('webix')

    .controller('loginController',function ($rootScope, $scope, $state, auth, user, $http, $localStorage, $window) {
        // if(!$localStorage.cert) {
        //     $window.location = $rootScope.apiUrl+'/test';
        // }

        auth.deleteLocalStorage();
        $scope.userLogin = {};
        $scope.doLogin = function () {
            user.login($scope.userLogin.username,$scope.userLogin.password);
        }

    });
