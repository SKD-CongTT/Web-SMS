/**
 * Created by sonsi_000 on 12/14/2016.
 */

angular.module('webix')
    .controller('positiveController',function ($scope,$rootScope,$http,$filter,$window,$mdDialog,$mdToast, auth) {
        if(auth.isAuthed()){

            $scope.loadingStudent = false;
            $scope.selected = false;
            $scope.ng_class = "";
            $scope.ng_session = "";
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
            var getSession = function () {
                if (auth.isAuthed()){
                    if ($rootScope.sessions.length === 0)
                        $http.get($rootScope.apiUrl + "/sessions/").then(function (response) {
                            $rootScope.sessions = response.data.results;
                        });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            getSession();
            $scope.filtedStudentsss = $rootScope.filtedStudents;
            $scope.getStudentByClass = function (value) {
                $scope.ng_session = "";
                $scope.selected = true;
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
                            $scope.students[i].ids =  $scope.students[i].id;
                        }
                        $scope.students.sort(function(a, b){
                            if (a.id < b.id) //sort string ascending
                                return -1 ;
                            if (a.id > b.id)
                                return 1;
                            return 0; //default return value (no sorting)
                        });
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
            $scope.getStudentBySession = function (value) {
                $scope.ng_class = "";
                $scope.selected = true;
                $scope.loadingStudent = true;
                var url = '/sessions/list_student_by_session/?session_id=' +  value.id + '&';
                if (auth.isAuthed()){
                    $http.get($rootScope.apiUrl + url + "limit=1000").then(function (response) {
                        $scope.students = response.data;
                        if (value === 'all') {
                            $scope.students = response.data.results;
                        }
                        for (var i = 0; i < $scope.students.length; i++){
                            $scope.students[i].year = Math.floor(2018 - $scope.students[i].username/10000);
                            $scope.students[i].ids =  $scope.students[i].id;
                        }
                        $scope.students.sort(function(a, b){
                            if (a.id < b.id) //sort string ascending
                                return -1 ;
                            if (a.id > b.id)
                                return 1;
                            return 0; //default return value (no sorting)
                        });
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
            };

            $scope.editScoreModal = function (value){
                if(auth.isAuthed()) {
                    var foundItem = $filter('filter')($rootScope.filtedStudents, { ids: value}, true)[0];
                    var index = $rootScope.filtedStudents.indexOf(foundItem );
                    var editStudent = $rootScope.filtedStudents[index];
                    var sessions = [];
                    for (var i = 0; i < editStudent.sessions.length; i++){
                        for (var j = 0; j < $rootScope.profile.sessions.length; j++){
                            if (editStudent.sessions[i] === $rootScope.profile.sessions[j].id)
                                sessions.push(editStudent.sessions[i]);
                        }
                    }
                    console.log(sessions);
                    console.log(editStudent);
                    console.log($rootScope.profile);
                    if (sessions.length === 0){
                        $mdToast.show(
                            $mdToast.simple()
                                .content("You don't teach this student in any class!")
                                .hideDelay(2000)
                                .position('right bottom')
                        );
                    }
                    else {
                        $mdDialog.show({
                            locals: {sessions: sessions, student: editStudent},
                            controller: DialogEditScoreController,
                            templateUrl: 'components/alerts/positive/editScoreTemplate.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            fullscreen: true
                        })
                    }
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            }
            function DialogEditScoreController($scope, sessions, student) {
                $scope.sessions = sessions;
                $scope.tmpscore = {};
                $scope.student = student;
                var toastSuccess = $mdToast.simple()
                    .textContent(student.last_name + student.first_name + '\'s Score Updated Successfully.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent(student.last_name + student.first_name + '\'s Score Updated Failed.')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.edit = function () {
                    if (auth.isAuthed) {
                        $scope.tmpscore.session = Number($scope.tmpscore.session);
                        console.log($scope.tmpscore);
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/scores/edit_many/',
                            data: [{
                                score: $scope.tmpscore.score,
                                session_id: $scope.tmpscore.session,
                                student_id: $scope.student.id
                            }]
                        }).success(function (response) {
                            $mdDialog.hide();
                            $mdToast.show(toastSuccess);
                        }).error(function () {
                            $mdDialog.hide();
                            $mdToast.show(toastFail);
                        })
                    } else {
                        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                        auth.logout();
                    }
                };
            }

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
