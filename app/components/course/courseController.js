angular.module('webix')

.controller('courseController',function ($scope,$rootScope,$http,$mdToast,auth,$timeout,$mdDialog) {
    if(auth.isAuthed()) {
        $scope.allCourseList = [];
        $scope.isNumber = angular.isNumber;
        $scope.chartConfig = {};
        $scope.countChartConfig = {};
        $scope.loadingCourseList = false;
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

          $scope.edit = function () {
            console.log($scope.requirements)
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
    var getAllCourse = function(force){
        if (auth.isAuthed()){
            return new Promise(function(resolve, reject) {
                if (force == 1 || $rootScope.showCourse.length == 0){
                $http.get($rootScope.apiUrl + '/courses/?limit=10000')
                .then(function (response) {
                    if(response.data.results !== false) {
                        $rootScope.showCourse = response.data.results;
                        $rootScope.showCourse.sort(function(a, b){
                            var idA=a.id.toLowerCase(), idB=b.id.toLowerCase()
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
            else{
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
        // if (value.requirements.length == 0)
        //     $scope.selectedCourse.requirements = "Not Active";
        if (value.active)
            $scope.selectedCourse.status = "Opening";
        else
            $scope.selectedCourse.status = "Closed";
    }
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

        $scope.addCourseModal = function () {
            if(auth.isAuthed()) {
                $mdDialog.show({
                    locals: {allCourse : $rootScope.showCourse},
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

        var toastSuccess = $mdToast.simple()
        .textContent('Xóa Webiste thành công')
        .position('right bottom');

        var toastFail = $mdToast.simple()
        .textContent('Xóa Website thất bại')
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
                    $http.delete($rootScope.apiUrl + ':81/courses/'+ value.id )
                    .success(function(response){
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                            getCourseInfo(0);
                        } else {
                            $mdToast.show(toastFail);
                        }
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

        function DialogAddController($scope, allCourse) {
            $scope.addedCourse = {};
            $scope.allCourse = [];
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
            console.log($scope.requirements)
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
                        department: $rootScope.profile.department
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