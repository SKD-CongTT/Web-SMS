angular.module('webix')
    .controller('scheduleController',function ($scope,$rootScope,$http,auth,$interval,$state,webNotification,searchQueryAlert,$mdToast,$mdDialog) {
        $scope.noti = {};
        var toastSuccess = $mdToast.simple()
            .textContent('Post notification Successful')
            .position('right bottom');

        var toastFail = $mdToast.simple()
            .textContent('Post notification Unsuccessful')
            .position('right bottom');
        $scope.post = function () {
            console.log($rootScope.profile);
            console.log($scope.noti);
            $http({
                method: 'POST',
                url: $rootScope.apiUrl + '/notifications/',
                data: {
                    title: $scope.noti.title,
                    session_id: $scope.noti.id,
                    content: $scope.noti.content
                }
            }).success(function () {
                $mdDialog.hide();
                $mdToast.show(toastSuccess);
            }).error(function () {
                $mdDialog.hide();
                $mdToast.show(toastFail);
            })
        }
    });
