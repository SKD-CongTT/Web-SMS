
angular.module('webix')
    .controller('registerController', function($scope,$rootScope,$http,auth,$interval,$state,$timeout,searchQuery,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            $scope.showClass = [];
            $scope.loadClass = false;
             $scope.loadingCourseList = false;
         var getAllCourse = function(force){
        if (auth.isAuthed()){
            return new Promise(function(resolve, reject) {
                if (force == 1 || $rootScope.showCourse.length == 0){
                $http.get($rootScope.apiUrl + '/courses/?limit=10000')
                .then(function (response) {
                    if(response.data.results !== false) {
                        $rootScope.showCourse = response.data.results;
                        $rootScope.showCourse.sort(function(a, b){
                            var idA=a.id.toLowerCase(), idB=b.id.toLowerCase()
                            if (idA < idB) //sort string ascending
                                return -1 ;
                            if (idA > idB)
                                return 1;
                            return 0; //default return value (no sorting)
                        });
                        resolve();
                    } else {
                        $rootScope.showCourse = [];
                        reject();
                    }
                })
            }
                 select($rootScope.showCourse[0]);
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
            $scope.loadClass = false;

            return new Promise(function(resolve, reject) {
                $http.get($rootScope.apiUrl + '/sessions/list_by_course_id/?course_id=' + $scope.selectedCourse.id)
                .then(function (response) {
                    $scope.loadClass = true;
                    if(response.data.results !== false) {
                        $scope.showClass = response.data.results;
                        console.log($scope.showClass);
                        resolve();
                    } else {
                        $scope.showClass = [];
                        reject();
                    }
                });
                $http.get($rootScope.apiUrl + '/sessions/count_enroll_by_course/?course_id=' + $scope.selectedCourse.id)
                .then(function (response) {
                    $scope.loadClass = true;
                    if(response.data.results !== false) {

                        // for (var i = 0; i < $scope.showClass.length; i ++)
                        //         $scope.showClass[i] += response.data.detail[i];
                        console.log(response.data);
                        resolve();
                    } else {
                        $scope.showClass = [];
                        reject();
                    }
                });
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
        getAllCourse(0).then(function(){
                select($scope.showCourse[0]);
        });
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });