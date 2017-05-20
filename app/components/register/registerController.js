
angular.module('webix')
    .controller('registerController', function($scope,$rootScope,$http,auth,$interval,$state,$timeout,searchQuery,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            $scope.showClass = [];
            $scope.registerRoom = [];
            $scope.loadClass = false;
            $scope.loadRoom = false;
            $scope.error = true;
            $scope.loadingCourseList = false;
            $scope.selectedCourse;
            var time = {
                1 : {
                    'start_at':'6h45',
                    'end_at' : '7h30'
                },
                2 : {
                    'start_at':'7h35',
                    'end_at' : '8h20'
                },
                3 : {
                    'start_at':'8h30',
                    'end_at' : '9h15'
                },
                4 : {
                    'start_at':'9h20',
                    'end_at' : '10h05'
                },
                5 : {
                    'start_at':'10h15',
                    'end_at' : '11h00'
                },
                6 : {
                    'start_at':'11h05',
                    'end_at' : '11h50'
                },
                7 : {
                    'start_at':'12h30',
                    'end_at' : '13h15'
                },
                8 : {
                    'start_at':'13h20',
                    'end_at' : '14h05'
                },
                9 : {
                    'start_at':'14h15',
                    'end_at' : '15h00'
                },
                10 : {
                    'start_at':'15h05',
                    'end_at' : '15h50'
                },
                11 : {
                    'start_at':'16h00',
                    'end_at' : '16h45'
                },
                12 : {
                    'start_at':'16h50',
                    'end_at' : '17h35'
                }
            };
            var lastindex = -1;
            var getAllCourse = function(force){
                if (auth.isAuthed()){
                    return new Promise(function(resolve, reject) {
                        if (force === 1 || $rootScope.showCourse.length === 0){
                            $http.get($rootScope.apiUrl + '/courses/?limit=10000')
                                .then(function (response) {
                                    if(response.data.results !== false) {
                                        $rootScope.showCourse = response.data.results;
                                        $rootScope.showCourse.sort(function(a, b){
                                            var idA=a.id.toLowerCase(), idB=b.id.toLowerCase();
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
                var messages = "";
                var setbreak = false;
                if (rows.length === 1){
                    for ( var i = 0; i < $scope.registerRoom.length; i++){
                        if ($scope.showClass[rows-1].id === $scope.registerRoom[i].id) {
                            setbreak = true;
                            lastindex = i;
                        }
                        if ($scope.showClass[rows-1].id !== $scope.registerRoom[i].id && $scope.showClass[rows-1].course_id === $scope.registerRoom[i].course_id){
                            lastindex = -1;
                            $scope.error = true;
                            messages = 'You cannot select more than 1 class in the same course';
                            $mdToast.show(
                                $mdToast.simple()
                                    .content(messages)
                                    .hideDelay(2000)
                                    .position('right bottom')
                            );
                            return;
                        }
                    }

                    if (!setbreak) {
                        lastindex += 1;
                        $scope.registerRoom.push($scope.showClass[rows - 1]);
                        messages = 'Selected class id: ' + $scope.showClass[rows - 1].id;
                        console.log( $scope.registerRoom);
                    }
                    else
                        messages = 'Already selected class id: ' + $scope.showClass[rows - 1].id;

                    $scope.loadRoom = true;
                    $scope.error = false;
                }
                else if(rows.length === 0 && lastindex !== -1) {
                    messages = 'Remove selected class id: ' + $scope.registerRoom[lastindex].id;
                    $scope.registerRoom.splice(lastindex, 1);
                }
                else{
                    lastindex = -1;
                    $scope.error = true;
                    messages = 'You cannot select more than 1 class in the same course';
                }
                $mdToast.show(
                    $mdToast.simple()
                        .content(messages)
                        .hideDelay(2000)
                        .position('right bottom')
                );
            };
            // var getAllSession = function(courseId){
            //
            // };
            $scope.remove = function (value) {
                for ( var i = 0; i < $scope.registerRoom.length; i++){
                    if ($scope.registerRoom[i].part_index === value) {
                        $scope.registerRoom.splice(i, 1);
                    }
                }
            }
            var toastSuccess = $mdToast.simple()
                .textContent('Register successfully')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Register unsuccessfully')
                .position('right bottom');

            $scope.register = function () {
                if (auth.isAuthed) {
                    var sessions_id = [];
                    for (var i = 0; i < $scope.registerRoom.length; i ++){
                        sessions_id.push($scope.registerRoom[i].id);
                    }
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/scores/register_many/',
                        data: {
                            session_ids: sessions_id,
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if(response.result === true) {
                            $mdToast.show(toastSuccess);
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            $scope.cancel = function () {
                if (auth.isAuthed) {
                    $scope.registerRoom = [];
                    $scope.loadRoom = false;
                    $scope.error = true;
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            var select = function (value){
                $scope.selectedCourse = value;
                if (auth.isAuthed()){
                    $scope.loadClass = false;

                    return new Promise(function(resolve, reject) {
                        $http.get($rootScope.apiUrl + '/sessions/list_by_course_id/?course_id=' + $scope.selectedCourse.id)
                            .then(function (response) {
                                if(response.data.results !== false) {
                                    $scope.showClass = response.data.results;
                                    for (var i = 0; i < $scope.showClass.length; i++) {
                                        $scope.showClass[i].part_index = i + 1;
                                        $scope.showClass[i].credit = $scope.selectedCourse.cost;
                                        $scope.showClass[i].requirements = $scope.selectedCourse.requirements.toString();
                                        $scope.showClass[i].time = time[$scope.showClass[i].start_at]['start_at'] + " - " + time[$scope.showClass[i].end_at]['end_at'];
                                    }
                                    $scope.loadClass = true;
                                    resolve();
                                } else {
                                    $scope.showClass = [];
                                    reject();
                                }
                            });
                    })
                }
                if (value.requirements.length === 0)
                    $scope.selectedCourse.requirements = "Not Active";
                if (value.active)
                    $scope.selectedCourse.status = "Opening";
                else
                    $scope.selectedCourse.status = "Closed";
            };
            $scope.select = select;
            getAllCourse(0).then(function(){
                select($scope.showCourse[0]);
            });
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });