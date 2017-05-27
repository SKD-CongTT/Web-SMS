/**
 * Created by sonsi_000 on 12/14/2016.
 */

angular.module('webix')
    .controller('positiveController',function ($scope,$rootScope,$http,auth) {
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
                    $http.get($rootScope.apiUrl + "/classes/").then(function (response) {
                        $scope.classes = response.data.results;
                    });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            getClass();
            $scope.getStudent = function (value) {
                $scope.loadingStudent = true;
                $scope.filtedStudents = [];
                console.log($scope.loadingStudent);
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
                        $scope.filtedStudents = $scope.students;
                        $scope.loadingStudent = false;
                    });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
