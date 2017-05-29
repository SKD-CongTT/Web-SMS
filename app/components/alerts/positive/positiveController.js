/**
 * Created by sonsi_000 on 12/14/2016.
 */

angular.module('webix')
    .controller('positiveController',function ($scope,$rootScope,$http,$filter,$window,auth) {
        if(auth.isAuthed()){

            $scope.loadingStudent = false;


            /*report wrong alert function*/
            $scope.alertList = {
                id: []
            };

            $scope.selectedRowCallback = function(rows){
                $scope.alertList.id = rows;
            };

            var getClass = function () {
                if (auth.isAuthed()){
                    if ($rootScope.classes.length === 0)
                    $http.get($rootScope.apiUrl + "/classes/").then(function (response) {
                        $rootScope.classes = response.data.results;
                    });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            getClass();
            $scope.filtedStudentsss = $rootScope.filtedStudents;
            $scope.getStudent = function (value) {
                $scope.loadingStudent = true;
                var url = '/classes/list_student_by_class/?class_id=' +  value.id + '&';
                if (value === 'all'){
                    url = '/students/?';
                }
                if (auth.isAuthed()){
                    $http.get($rootScope.apiUrl + url + "limit=1000").then(function (response) {
                        $scope.students = response.data;
                        if (value === 'all') {
                            $scope.students = response.data.results;
                        }
                        for (var i = 0; i < $scope.students.length; i++){
                            $scope.students[i].year = Math.floor(2018 - $scope.students[i].username/10000);
                        }
                        $rootScope.filtedStudents = $scope.students;
                        $scope.filtedStudentsss = $rootScope.filtedStudents;
                        $scope.loadingStudent = false;
                    });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            $scope.showresult = function (value) {
                var foundItem = $filter('filter')($rootScope.filtedStudents, { id: value  }, true)[0];
                var index = $rootScope.filtedStudents.indexOf(foundItem );
                $rootScope.selectedStudent = $rootScope.filtedStudents[index];
                $window.location.href = 'http://sms.ict.vn:8000/#/alerts/student_result';
            }

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
