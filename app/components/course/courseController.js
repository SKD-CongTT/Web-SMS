angular.module('webix')

    .controller('courseController',function ($scope,$rootScope,$http,$mdToast,auth,$timeout,$mdDialog) {
        if(auth.isAuthed()) {
            var time = {
                1 : {
                    'period' : 1,
                    'start_at':'6h45',
                    'end_at' : '7h30'
                },
                2 : {
                    'period' : 2,
                    'start_at':'7h35',
                    'end_at' : '8h20'
                },
                3 : {
                    'period' : 3,
                    'start_at':'8h30',
                    'end_at' : '9h15'
                },
                4 : {
                    'period' : 4,
                    'start_at':'9h20',
                    'end_at' : '10h05'
                },
                5 : {
                    'period' : 5,
                    'start_at':'10h15',
                    'end_at' : '11h00'
                },
                6 : {
                    'period' : 6,
                    'start_at':'11h05',
                    'end_at' : '11h50'
                },
                7 : {
                    'period' : 7,
                    'start_at':'12h30',
                    'end_at' : '13h15'
                },
                8 : {
                    'period' : 8,
                    'start_at':'13h20',
                    'end_at' : '14h05'
                },
                9 : {
                    'period' : 9,
                    'start_at':'14h15',
                    'end_at' : '15h00'
                },
                10 : {
                    'period' : 10,
                    'start_at':'15h05',
                    'end_at' : '15h50'
                },
                11 : {
                    'period' : 11,
                    'start_at':'16h00',
                    'end_at' : '16h45'
                },
                12 : {
                    'period' : 12,
                    'start_at':'16h50',
                    'end_at' : '17h35'
                }
            };
            $scope.rooms = [];
            $scope.allCourseList = [];
            $scope.department = [];
            $scope.isNumber = angular.isNumber;
            $scope.chartConfig = {};
            $scope.countChartConfig = {};
            $scope.loadingCourseList = true;
            $scope.loadingChart = true;
            $scope.loadingChartPie = true;
            $scope.selectedWebsite = {};
            $scope.selectedRange = 0;
            $scope.limitTime = 0;
            $scope.query = "";
            $scope.count = 0;
            $scope.editCourseModal = function (value){
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {courseInfo : value, allCourse : $rootScope.showCourse},
                        controller: DialogEditController,
                        templateUrl: 'components/course/editCourseTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            }
            function DialogEditController($scope, courseInfo, allCourse) {
                $scope.courseInfo = courseInfo;
                $scope.allCourse = [];
                for (var each in allCourse)
                    $scope.allCourse.push(allCourse[each].id);
                $scope.allCourse.splice($scope.allCourse.indexOf($scope.courseInfo.id), 1);
                $scope.requirements = angular.copy(courseInfo.requirements);
                var toastSuccess = $mdToast.simple()
                    .textContent('Course Information Updated Successfully.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Course Information Updated Failed.')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.exist = function(item) {
                    var idx = $scope.requirements.indexOf(item);
                    if (idx > -1)
                        return true;
                    else
                        return false;
                };
                $scope.toggle = function (item) {
                    var idx = $scope.requirements.indexOf(item);
                    if (idx > -1) {
                        $scope.requirements.splice(idx, 1);
                    }
                    else {
                        $scope.requirements.push(item);
                    }
                };
                console.log($scope.courseInfo);

                $scope.edit = function () {
                    if (auth.isAuthed) {
                        $http({
                            method: 'PATCH',
                            url: $rootScope.apiUrl + '/courses/' + $scope.courseInfo.id + "/",
                            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            // transformRequest: function (obj) {
                            //     var str = [];
                            //     for (var p in obj)
                            //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            //     return str.join("&");
                            // },
                            data: {
                                id: $scope.courseInfo.id,
                                name: $scope.courseInfo.name,
                                cost: $scope.courseInfo.cost,
                                active: $scope.courseInfo.active,
                                requirements: $scope.requirements
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            $mdToast.show(toastSuccess);
                            getAllCourse(1);
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
            var getRoom = function (){
                $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + '/rooms/list_building/?limit=1000'
                }).success(function (response) {
                    $scope.buildings = response;
                    console.log($scope.buildings);
                });
            };
            getRoom();
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
                                        select($rootScope.showCourse[0]);
                                        $scope.loadingCourseList = false;
                                        resolve();
                                    } else {
                                        $scope.loadingCourseList = false;
                                        $rootScope.showCourse = [];
                                        reject();
                                    }
                                })
                        }
                        else{
                            $scope.loadingCourseList = false;
                            select($rootScope.showCourse[0]);
                        }
                    })
                }
            };
            var select = function (value){
                $scope.selectedCourse = value;
                $scope.selectedCourse.require = value.requirements[0];
                for (i = 1; i < value.requirements.length; i++){
                    $scope.selectedCourse.require = $scope.selectedCourse.require + "; " + value.requirements[i];
                }
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
                        } else {
                            $scope.showClass = [];
                        }
                    });
                // if (value.requirements.length == 0)
                //     $scope.selectedCourse.requirements = "Not Active";
                if (value.active)
                    $scope.selectedCourse.status = "Opening";
                else
                    $scope.selectedCourse.status = "Closed";
            };
            $scope.select = select;

            getAllCourse(0).then(function(){
                select($rootScope.showCourse[0]);
            });

            $scope.selectWebsite = function (id,hostName) {
                $scope.loadingChart = true;
                $scope.loadingChartPie = true;
                // $scope.loadingTable = true;
                $scope.selectedRange = 0;

            };
            var getDepartment = function () {
                if (auth.isAuthed) {
                    $http.get($rootScope.apiUrl + '/departments/'
                    ).then(function (response) {
                        if(response.statusText === 'OK') {
                            $scope.department = response.data.results;
                        } else {
                            $rootScope.showCourse = [];
                        }
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            }
            getDepartment();

            $scope.addCourseModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {allCourse : $rootScope.showCourse, allDepartment : $scope.department},
                        controller: DialogAddController,
                        templateUrl: 'components/course/addCourseTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen: true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            $scope.addSessionModal = function (value) {
                console.log(value)
                $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + '/lecturers/list_by_course_id/?course_id='+value.id+'&limit=1000'
                }).success(function (response) {
                   $scope.lecturers = response.results;
                    if(auth.isAuthed()) {
                        $mdDialog.show({
                            locals: {value : value, time: time, buildings : $scope.buildings, lecturers: $scope.lecturers},
                            controller: DialogAddSController,
                            templateUrl: 'components/course/addSessionTemplate.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose:true,
                            fullscreen: true
                        })
                    } else {
                        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                        auth.logout();
                    }
                });
            };

            var toastSuccess = $mdToast.simple()
                .textContent('Delete Successful')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Delete Unsuccessful')
                .position('right bottom');

            $scope.deleteCourseModal = function (value) {
                if(auth.isAuthed()) {
                    $scope.selectedCourse = angular.copy(this.value);

                    var confirm = $mdDialog.confirm()
                        .title('Are you sure to delete this course: ' + $scope.selectedCourse.name+ ' ?')
                        .textContent('All data that related with this course will be deleted.')
                        .ariaLabel('Deleted course.')
                        .ok('Confirm')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function() {
                        $http.delete($rootScope.apiUrl + '/courses/'+ value.id )
                            .success(function(response){
                                $mdToast.show(toastSuccess);
                                getAllCourse(1);
                            }).error(function () {
                            $mdToast.show(toastFail);
                        })

                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogAddController($scope, allCourse, allDepartment) {
                $scope.addedCourse = {};
                $scope.allCourse = [];
                $scope.allDepartment = allDepartment;
                $scope.department = 0;
                for (var each in allCourse)
                    $scope.allCourse.push(allCourse[each].id);
                // $scope.allCourse.splice($scope.allCourse.indexOf($scope.courseInfo.id), 1);
                $scope.requirements = []
                var toastSuccess = $mdToast.simple()
                    .textContent('Course Information Added Successfully.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Course Information Added Failed.')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.exist = function(item) {
                    var idx = $scope.requirements.indexOf(item);
                    if (idx > -1)
                        return true;
                    else
                        return false;
                };
                $scope.toggle = function (item) {
                    var idx = $scope.requirements.indexOf(item);
                    if (idx > -1) {
                        $scope.requirements.splice(idx, 1);
                    }
                    else {
                        $scope.requirements.push(item);
                    }
                };

                $scope.add = function () {
                    if (auth.isAuthed) {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/courses/',
                            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            // transformRequest: function (obj) {
                            //     var str = [];
                            //     for (var p in obj)
                            //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            //     return str.join("&");
                            // },
                            data: {
                                id: $scope.addedCourse.id,
                                name: $scope.addedCourse.name,
                                cost: $scope.addedCourse.cost,
                                active: $scope.addedCourse.active,
                                requirements: $scope.requirements,
                                session: $scope.addedCourse.session,
                                department: $scope.department
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            $mdToast.show(toastSuccess);
                            getAllCourse(1);
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
            function DialogAddSController($scope, value, time, buildings, lecturers) {
                $scope.lecturers = lecturers;
                $scope.buildings = buildings;
                $scope.selectedCourse = value;
                $scope.count = 0;
                $scope.is_full = true;
                $scope.loading = true;
                var d = new Date();
                $scope.year_option = d.getFullYear();
                $scope.info = {};
                $scope.period = time;
                var toastSuccess = $mdToast.simple()
                    .textContent('Assign Successfully.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Assign Unsuccessfully. May be your input data is invalid or because of duplication of timetable.')
                    .position('right bottom');
                var toastFailConnect = $mdToast.simple()
                    .textContent('Unable to Connect to Server.')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                if ($scope.selectedCourse.active) {
                    $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + '/sessions/list_by_course_id/?course_id=' + $scope.selectedCourse.id
                    }).success(function (response) {
                        $scope.count = response.count;
                        if ($scope.selectedCourse.session_num <= response.count)
                            $scope.is_full = true;
                        else
                            $scope.is_full = false;
                        $scope.loading = false;
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFailConnect);
                    })
                }
                else {
                    $scope.is_full = false;
                }
                $scope.showRoom = function (value) {
                    $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + '/rooms/list_room_by_building/?building=' + value + '&limit=1000'
                    }).success(function (response) {
                        $scope.rooms = response;
                    })
                };
                $scope.add = function () {
                    console.log($scope.info);
                    if (auth.isAuthed) {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/sessions/',
                            data: {
                                year: $scope.info.year,
                                semester: $scope.info.semester,
                                start_at: $scope.info.start_at,
                                end_at: $scope.info.end_at,
                                max_enroll: $scope.info.max_enroll,
                                course_id: $scope.selectedCourse.id,
                                room : $scope.info.room,
                                lecturer_id: $scope.info.lecturer,
                                week_day: $scope.info.day
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            $mdToast.show(toastSuccess);
                            getAllCourse(1);
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
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    });