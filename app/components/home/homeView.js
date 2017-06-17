angular.module('webix')
    .controller('generalController', function($scope,$http,$interval,auth,$rootScope,$timeout,$mdToast, $state,webNotification,searchQuery) {
        if(auth.isAuthed()){

            searchQuery.setQuery("");
            $scope.allCourseList = [];
            $scope.availableCourse = [];
            $scope.isNumber = angular.isNumber;
            $scope.notifications = [];
            $scope.panelResult = [{
                name : "Member",
                info : 0,
                href : "dashboard.student_management"
            },{
                name : "Course Available",
                info : 0,
                href : "dashboard.course_information"
            },{
                name : "Semester",
                info : 3,
            },{
                name : "Year",
                info : "2016 - 2017",
            }];

            var getNotification = function () {
                if (auth.isAuthed()) {
                    $http.get($rootScope.apiUrl + '/notifications/list_noti_for_user/').then(
                        function (response) {
                            $http({
                                method: 'POST',
                                url: $rootScope.apiUrl + '/notifications/list_noti_detail/',
                                data: response.data
                            }).then(
                                function (response) {
                                    var lenNoti = response.data.length;
                                    for (var i = 0; i < lenNoti; i ++){
                                        response.data[i].date = response.data[i].date.replace("T", " ");
                                        response.data[i].date = response.data[i].date.slice(0, 19);
                                    }
                                    $scope.notifications = response.data;
                                }
                            )
                        }
                    )
                }
            };
            getNotification();
            $scope.deleteNotification = function (id) {
                $http({
                    method: 'DELETE',
                    url: $rootScope.apiUrl + '/notifications/' + id
                }).then (
                    function (response) {
                        $mdToast.show($mdToast.simple()
                            .textContent('Delete notification successfully.')
                            .position('right bottom'));
                        getNotification();
                    }
                )
            };
            var getAvailableCourse = function () {
                if (auth.isAuthed()){
                    return new Promise(function(resolve, reject) {
                        if ($rootScope.showCourse.length === 0){
                            $http.get($rootScope.apiUrl + '/courses/?limit=10000')
                                .then(function (response) {
                                    if(response.data.results !== false) {
                                        $scope.allCourseList = response.data.results;
                                        var count = response.data.count;
                                        for (i = 0; i < count; i++ ){
                                            if ($scope.allCourseList[i].active){
                                                $scope.availableCourse.push($scope.allCourseList[i]);
                                                $scope.panelResult[1].info += 1;
                                            }
                                        }
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                })
                        }
                        else{
                            for ( i = 0; i < $rootScope.showCourse.length; i ++){
                                if ($rootScope.showCourse[i].active){
                                    $scope.availableCourse.push($rootScope.showCourse[i]);
                                    $scope.panelResult[1].info += 1;
                                }
                            }
                        }
                    })
                }
            };
            getAvailableCourse();
            function sleep(milliseconds) {
                var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                    if ((new Date().getTime() - start) > milliseconds){
                        break;
                    }
                }
            }
            var getMember = function () {
                if (auth.isAuthed()){
                    return new Promise(function(resolve, reject) {
                        $http.get($rootScope.apiUrl + '/students/count_all_student/')
                            .then(function (response) {
                                if(response.data.results !== false) {
                                    $scope.panelResult[0].info = response.data.count;
                                    resolve();
                                } else {
                                    reject();
                                }
                            })
                    })
                }
            };
            getMember();
            // $scope.days = {
            //     monday: {
            //         name: 'Monday',
            //         slots: {
            //             1: {
            //                 time: '9:00am - 11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Database'
            //             },
            //             2: {
            //                 time: '11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math1'
            //             },
            //             3: {
            //                 time: '1:00pm',
            //                 booked: false,
            //                 room: 'D9 - 408',
            //                 name: 'Math2'
            //             },
            //             4: {
            //                 time: '3:00pm',
            //                 booked: false,
            //                 room: 'SVD',
            //                 name: 'Cau Long'
            //             },
            //         }
            //     },
            //     tuesday: {
            //         name: 'Tuesday',
            //         slots: {
            //             1: {
            //                 time: '9:00am - 11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             },
            //             2: {
            //                 time: '11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             },
            //             3: {
            //                 time: '1:00pm',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             },
            //         }
            //     },
            //     wednesday: {
            //         name: 'Wednesday',
            //         slots: {
            //             1: {
            //                 time: '9:00am - 11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             },
            //             2: {
            //                 time: '7:00pm',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             }
            //         }
            //     },
            //     thursday: {
            //         name: 'Thursday',
            //         slots: {
            //             1: {
            //                 time: '10:00am - 11:00am',
            //                 booked: false,
            //                 room: 'D9- 407',
            //                 name: 'English Skill 1'
            //             },
            //             2: {
            //                 time: '7:00pm',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             }
            //         }
            //     },
            //     friday: {
            //         name: 'Friday',
            //         slots: {
            //             1: {
            //                 time: '9:00am - 11:00am',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             },
            //             2: {
            //                 time: '7:00pm',
            //                 booked: false,
            //                 room: 'D9',
            //                 name: 'Math2'
            //             }
            //         }
            //     },
            // }
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });