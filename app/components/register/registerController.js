
angular.module('webix')
    .controller('registerController', function($scope,$rootScope,$http,auth,$interval,$state,$timeout,searchQuery,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            $scope.showCourse = [];
            $scope.showClass = [];
             $scope.loadingCourseList = false;
        var getAllCourse = function(){
        if (auth.isAuthed()){
            return new Promise(function(resolve, reject) {
                $http.get($rootScope.apiUrl + '/courses/?limit=10000')
                .then(function (response) {
                    if(response.data.results !== false) {
                        $scope.showCourse = response.data.results;
                        resolve();
                    } else {
                        $scope.showCourse = [];
                        reject();
                    }
                })
            })
        }
    };
    $scope.selectedRowCallback = function(rows){
            $mdToast.show(
                $mdToast.simple()
                    .content('Selected row id(s): '+rows)
                    .hideDelay(3000)
            );
        };
        var getAllSession = function(courseId){

        }
        var select = function (value){
        $scope.selectedCourse = value;
        $scope.selectedCourse.require = value.requirements[0];
                if (auth.isAuthed()){
            return new Promise(function(resolve, reject) {
                $http.get($rootScope.apiUrl + '/sessions/list_by_course_id/?course_id=' + $scope.selectedCourse.id)
                .then(function (response) {
                    if(response.data.results !== false) {
                        $scope.showClass = response.data.results;
                        resolve();
                    } else {
                        $scope.showCourse = [];
                        reject();
                    }
                })
            })
        }
        if (value.requirements.length == 0)
            $scope.selectedCourse.requirements = "Not Active";
        if (value.active)
            $scope.selectedCourse.status = "Opening";
        else
            $scope.selectedCourse.status = "Closed";
    }
    $scope.select = select;
        getAllCourse().then(function(){
                select($scope.showCourse[0]);
        });
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });