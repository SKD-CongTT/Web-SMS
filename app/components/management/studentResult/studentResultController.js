angular.module('webix')
    .controller('studentResultController',function ($scope,$rootScope,$http,auth,$interval,$state,webNotification,searchQueryAlert,$mdToast,$filter, $mdDialog) {
        if(auth.isAuthed()){
            $scope.score = [];
            var getScore = function (value) {
                if (auth.isAuthed()){
                    if (!$rootScope.selectedStudent.hasOwnProperty('student_id'))
                        $rootScope.selectedStudent.student_id = $rootScope.selectedStudent.id;
                    if ($scope.score.length === 0 || value === 1)
                        $http.get($scope.apiUrl + "/scores/list_score_by_student/?student_id=" + $rootScope.selectedStudent.student_id).then(function (response) {
                            $scope.score = response.data.results;
                            for (var i = 0; i < $scope.score.length; i ++ ){
                                if ($scope.score[i].score >= 9.0)
                                    $scope.score[i].text_score = 'A+';
                                else if ($scope.score[i].score >= 8.5)
                                    $scope.score[i].text_score = 'A';
                                else if ($scope.score[i].score >= 8.0)
                                    $scope.score[i].text_score = 'B+';
                                else if ($scope.score[i].score >= 7.0)
                                    $scope.score[i].text_score = 'B';
                                else if ($scope.score[i].score >= 6.5)
                                    $scope.score[i].text_score = 'C+';
                                else if ($scope.score[i].score >= 5.5)
                                    $scope.score[i].text_score = 'C';
                                else if ($scope.score[i].score >= 5.0)
                                    $scope.score[i].text_score = 'D+';
                                else if ($scope.score[i].score >= 3.5)
                                    $scope.score[i].text_score = 'D';
                                else if ($scope.score[i].score === -1){
                                    $scope.score[i].text_score = 'NOT ACTIVE';
                                    $scope.score[i].score = 'NOT ACTIVE';
                                }
                                else
                                    $scope.score[i].text_score = 'F';
                            }
                        });
                }
                else{
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            getScore(1);
            $scope.editScoreModal = function (value){
                if(auth.isAuthed()) {
                    var sessions = [];
                    for (var i = 0; i < $rootScope.selectedStudent.sessions.length; i++){
                        for (var j = 0; j < $rootScope.profile.sessions.length; j++){
                            if ($rootScope.selectedStudent.sessions[i] === $rootScope.profile.sessions[j].id)
                                sessions.push($rootScope.selectedStudent.sessions[i]);
                        }
                    }
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
                            locals: {sessions: sessions, student: $rootScope.selectedStudent},
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
                        }).then(function (response) {
                            if (response.data.result) {
                                $mdDialog.hide();
                                $mdToast.show(toastSuccess);
                                getScore(1);
                            }
                            else {
                                $mdDialog.hide();
                                $mdToast.show(toastFail);
                            }
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
