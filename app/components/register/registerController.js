
angular.module('webix')
    .controller('registerController', function($scope,$rootScope,$http,auth,$interval,$state,$timeout,searchQuery,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            $scope.showClass = [];
            $scope.registerRoom = [];
            $scope.loadClass = false;
            $scope.loadRoom = false;
            $scope.error = true;
            $scope.loadingCourseList = true;
            $scope.selectedCourse;
            $scope.valid = true;
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
                                        for (var i = 0; i < $rootScope.showCourse.length; i++){
                                            if ($rootScope.showCourse[i].name.length > 15){
                                                $rootScope.showCourse[i].display = $rootScope.showCourse[i].name.slice(0, 13) + "...";
                                                // console.log($rootScope.showCourse[i].name.slice(3,10));
                                            }
                                            else
                                                $rootScope.showCourse[i].display = $rootScope.showCourse[i].name;
                                        }
                                        $scope.loadingCourseList = false;
                                        resolve();
                                    } else {
                                        $rootScope.showCourse = [];
                                        reject();
                                    }
                                })
                        }
                        else
                            $scope.loadingCourseList = false;
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
                            "session_ids": sessions_id,
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if(response.result === true) {
                            $mdToast.show(toastSuccess);
                            $http.get($rootScope.apiUrl + '/users/').then(function (response){
                                if(response.data.results !== false) {
                                    $rootScope.profile = response.data;
                                    $rootScope.loading = false;
                                    $rootScope.profile.Name = response.data.last_name + " " + response.data.first_name;
                                    $rootScope.profile.date_joined = $rootScope.profile.date_joined.replace("T", " ");
                                    $rootScope.profile.date_joined = $rootScope.profile.date_joined.replace("Z", " ");
                                    // $rootScope.profile.last_login = $rootScope.profile.last_login.replace("T", " ");
                                    // $rootScope.profile.last_login = $rootScope.profile.last_login.replace("Z", " ");
                                    var role = auth.getGroup();
                                    if (role === "lecturer"){
                                        $rootScope.profile.type = "LECTURER";
                                    }
                                    else if (role === "admin"){
                                        $rootScope.profile.type = "ADMIN";
                                    }
                                    else{
                                        $rootScope.profile.type = "STUDENT";
                                        $rootScope.selectedStudent = $rootScope.profile;
                                    }
                                    $rootScope.profile.notExist = false;
                                    $rootScope.days = [
                                        {
                                            name: 'Monday',
                                            slots: [

                                            ]
                                        },{
                                            name: 'Tuesday',
                                            slots: [

                                            ]
                                        },{
                                            name: 'Wednesday',
                                            slots: [

                                            ]
                                        },{
                                            name: 'Thursday',
                                            slots: [

                                            ]
                                        },{
                                            name: 'Friday',
                                            slots: [

                                            ]
                                        },
                                        {
                                            name: 'Saturday',
                                            slots: [

                                            ]
                                        }
                                    ];
                                    for (var i = 0; i < $rootScope.profile.sessions.length; i++){
                                        var time = $rootScope.period[$rootScope.profile.sessions[i].start_at].start_at + " - " + $rootScope.period[$rootScope.profile.sessions[i].end_at].end_at;
                                        var temp = {
                                            'time' : time,
                                            'name' : $rootScope.profile.sessions[i].course_id,
                                            'room' : $rootScope.profile.sessions[i].room,
                                            'class': $rootScope.profile.sessions[i].name
                                        };
                                        $rootScope.days[$rootScope.profile.sessions[i].week_day - 2].slots.push(temp);
                                    }
                                } else {
                                    $location.path('/login');
                                }
                            });
                        } else {
                            $mdToast.show($mdToast.simple()
                                .textContent('Register unsuccessfully. ' + response.reason)
                                .position('right bottom'));
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
                $scope.showClass = [];
                if (auth.isAuthed()) {
                    $scope.loadClass = false;
                    if (value.active) {
                        $scope.valid = true;
                        return new Promise(function (resolve, reject) {
                            $http.get($rootScope.apiUrl + '/sessions/list_by_course_id/?course_id=' + $scope.selectedCourse.id)
                                .then(function (response) {
                                    if (response.data.results !== false) {
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
                    else{
                        $scope.valid = false;
                        $scope.showClass = [];
                    }
                }
            };
            $scope.select = select;
            getAllCourse(0);
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });