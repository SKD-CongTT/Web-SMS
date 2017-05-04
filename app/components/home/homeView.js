angular.module('webix')
.controller('generalController', function($scope,$http,$interval,auth,$rootScope,$timeout,$state,webNotification,searchQuery) {
    if(auth.isAuthed()){

        searchQuery.setQuery("");
        $scope.allCourseList = [];
        $scope.availableCourse = [];
        $scope.isNumber = angular.isNumber;
        $scope.panelResult = [{
            name : "Member",
            info : 0,
            href : "dashboard.logs"
        },{
            name : "Course Available",
            info : 0,
            href : "dashboard.course_information"
        },{
            name : "Time",
            info : 0,
            href : "dashboard.course_information"
        },{
            name : "Unknow",
            info : 0,
            href : "dashboard.logs"
        }];

        /*Agent chart*/

        Highcharts.setOptions({
            global: {
                timezoneOffset: 0
            }
        });
        var getAvailableCourse = function () {
            if (auth.isAuthed()){
                return new Promise(function(resolve, reject) {
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
                    $http.get($rootScope.apiUrl + '/students/')
                    .then(function (response) {
                        console.log(response)
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
        $scope.days = {
                        monday: {
                            name: 'Monday',
                            slots: {
                              1: {
                                time: '9:00am - 11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Database'
                              },
                             2: {
                                time: '11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Math1'
                              },
                              3: {
                                time: '1:00pm',
                                booked: false,
                                room: 'D9 - 408',
                                name: 'Math2'
                              },
                              4: {
                                time: '3:00pm',
                                booked: false,
                                room: 'SVD',
                                name: 'Cau Long'
                              },
                              }
                        },
                        tuesday: {
                            name: 'Tuesday',
                            slots: {
                              1: {
                                time: '9:00am - 11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              },
                              2: {
                                time: '11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              },
                              3: {
                                time: '1:00pm',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              },
                              }
                        },
                        wednesday: {
                            name: 'Wednesday',
                            slots: {
                              1: {
                                time: '9:00am - 11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              },
                              2: {
                                time: '7:00pm',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              }
                              }
                        },
                        thursday: {
                            name: 'Thursday',
                            slots: {
                              1: {
                                time: '10:00am - 11:00am',
                                booked: false,
                                room: 'D9- 407',
                                name: 'English Skill 1'
                              },
                              2: {
                                time: '7:00pm',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              }
                              }
                        },
                        friday: {
                            name: 'Friday',
                            slots: {
                              1: {
                                time: '9:00am - 11:00am',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              },
                              2: {
                                time: '7:00pm',
                                booked: false,
                                room: 'D9',
                                name: 'Math2'
                              }
                              }
                        },
                 }
    } else {
        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
        auth.logout();
    }
});