angular.module('webix')
    .controller('listStudentController',function ($scope,$rootScope,$http,$filter,$window,$mdDialog,$mdToast, auth) {
        if(auth.isAuthed()){

            $scope.loadingStudent = false;
            $scope.selected = false;
            $scope.ng_class = "";
            $scope.ng_session = "";
            $scope.expression = "";
            $scope.alertList = {
                id: []
            };

            $scope.selectedRowCallback = function(rows){
                $scope.alertList.id = rows;
            };

            var getClass = function () {
                if (auth.isAuthed()){
                    if ($rootScope.classes.length === 0)
                        $http.get($rootScope.apiUrl + "/classes/?limit=1000").then(function (response) {
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
                        $http.get($rootScope.apiUrl + "/sessions/?limit=1000").then(function (response) {
                            $rootScope.sessions = response.data.results;
                        });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            getSession();
            $scope.search = function () {
                var query = $scope.expression.toLocaleLowerCase();
                $scope.filtedStudentsss = []
                for (var i = 0; i < $rootScope.filtedStudents.length; i++){
                    var each = $rootScope.filtedStudents[i];
                    if (each.username.toLocaleLowerCase().indexOf(query) >=0 || each.first_name.toLocaleLowerCase().indexOf(query) >=0 || each.last_name.toLocaleLowerCase().indexOf(query) >=0){
                        $scope.filtedStudentsss.push(each);
                    }
                }
            }
            $scope.filtedStudentsss = $rootScope.filtedStudents;
            console.log($scope.filtedStudentsss);
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
                if (!$rootScope.selectedStudent.hasOwnProperty('student_id'))
                    $rootScope.selectedStudent.student_id = $rootScope.selectedStudent.id;
                $window.location.href = 'http://sms.ict.vn:8000/#/management/student_result';
            };

            $scope.editScoreModal = function (value){
                if(auth.isAuthed()) {
                    var foundItem = $filter('filter')($rootScope.filtedStudents, { ids: value}, true)[0];
                    var index = $rootScope.filtedStudents.indexOf(foundItem );
                    var editStudent = $rootScope.filtedStudents[index];
                    var sessions = [];
                    for (var i = 0; i < editStudent.sessions.length; i++){
                        for (var j = 0; j < $rootScope.profile.sessions.length; j++){
                            if (editStudent.sessions[i] === $rootScope.profile.sessions[j].id){
                                temp = {
                                    session : editStudent.sessions[i],
                                    name : $rootScope.profile.sessions[j].name
                                };
                                sessions.push(temp);
                            }
                        }
                    }
                    var foundItem = $filter('filter')(sessions, { session: Number($scope.ng_session)}, true)[0];
                    var index = sessions.indexOf(foundItem );
                    console.log(editStudent);
                    console.log(foundItem);
                    console.log($scope.ng_session);
                    console.log(sessions);
                    console.log($rootScope.profile);
                    if (sessions.length === 0 || ($scope.ng_session !== "" && index < 0)){
                        $mdToast.show(
                            $mdToast.simple()
                                .content("You don't teach this student in any class!")
                                .hideDelay(2000)
                                .position('right bottom')
                        );
                    }
                    else {
                        if (!editStudent.hasOwnProperty('student_id'))
                            editStudent.student_id = editStudent.id;
                        $mdDialog.show({
                            locals: {sessions: sessions, student: editStudent, ng_session: $scope.ng_session},
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
            };
            function DialogEditScoreController($scope, sessions, student, ng_session) {
                $scope.sessions = sessions;
                $scope.tmpscore = {};
                if (ng_session !== "")
                    $scope.tmpscore.session = ng_session;
                console.log($scope.tmpscore.session);
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
                        console.log($scope.tmpscore.session);
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/scores/edit_many/',
                            data: [{
                                score: $scope.tmpscore.score,
                                session_id: $scope.tmpscore.session,
                                student_id: $scope.student.student_id
                            }]
                        }).success(function () {
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
