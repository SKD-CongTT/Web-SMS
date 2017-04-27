angular.module('webix')

.controller('courseController',function ($scope,$rootScope,$http,$mdToast,auth,$timeout,$mdDialog) {
    if(auth.isAuthed()) {
        $scope.allCourseList = [];
        $scope.showCourse = [];
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
                    locals: {courseInfo : value},
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
        function DialogEditController($scope, courseInfo) {
            $scope.courseInfo = courseInfo;
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
            if (auth.isAuthed) {
                $http({
                    method: 'PUT',
                    url: $rootScope.apiUrl + ':81/course/' + $scope.courseInfo.id + "/",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        id: $scope.courseInfo.id,
                        name: $scope.courseInfo.name,
                        cost: $scope.courseInfo.cost,
                        active: $scope.courseInfo.active,
                        requirements: $scope.requirements
                    }
                }).success(function (response) {
                    $mdDialog.hide();
                    if(response['result']) {
                        $mdToast.show(toastSuccess);
                        refresh();
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
    }
    var getAllCourse = function(){
        if (auth.isAuthed()){
            return new Promise(function(resolve, reject) {
                $http.get($rootScope.apiUrl + ':81/courses/?limit=10000')
                .then(function (response) {
                    if(response.data.results !== false) {
                        console.log(response)
                        $scope.showCourse = response.data.results.slice(0,10);
                        $scope.allCourseList = response.data.results;
                        $scope.count = response.data.count;
                        $scope.itemRemain = $scope.count - 10;
                        resolve();
                    } else {
                        $scope.showCourse = [];
                        reject();
                    }
                })
            })
        }
    };
    var select = function (value){
        $scope.selectedCourse = value;
        $scope.selectedCourse.require = value.requirements[0];
        for (i = 1; i < value.requirements.length; i++){
            $scope.selectedCourse.require = $scope.selectedCourse.require + "; " + value.requirements[i];
        }
        if (value.requirements.length == 0)
            $scope.selectedCourse.requirements = "Not Active";
        if (value.active)
            $scope.selectedCourse.status = "Opening";
        else
            $scope.selectedCourse.status = "Closed";
    }
    $scope.select = select;
    $scope.searchCourse = function (query) {
        if(query != "") {
           $http({
            method: 'GET',
            url: $rootScope.apiUrl + ':81/courses/' + query,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
        }).success(function (response) {
            console.log(response)
            if(response['result'] == false) {
                $scope.courseSearchList = [];
            } else {
                $scope.courseSearchList = response['result'];
            }
        }).error(function () {
            $scope.courseSearchList = [];

                        // console.log(response);
                    })
    }

};

        getAllCourse().then(function(){
                select($scope.showCourse[0]);
        });
        var page = 10;
        $scope.itemRemain = 0;
        $scope.hasMoreItemsToShow = function() {
            //server return 10 items each request
            return page < ($scope.count);
        };

        $scope.showMoreItems = function() {
            page = page + 10;
            $scope.itemRemain -= 10;
            $scope.showCourse = $scope.allCourseList.slice(0, page)            
        };


        $scope.selectWebsite = function (id,hostName) {
            $scope.loadingChart = true;
            $scope.loadingChartPie = true;
            // $scope.loadingTable = true;
            $scope.selectedRange = 0;
            
        };

        $scope.addCourseModal = function () {
            console.log($scope.allCourseList)
            if(auth.isAuthed()) {
                $mdDialog.show({
                    locals: {allCourseList: $scope.allCourseList},
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

        $scope.editWebsiteModal = function () {
            $scope.selectedWebsite = angular.copy(this.value);
            $scope.selectedWebsite.port = Number(this.value.port);
            $scope.selectedWebsite.learningTime = Number(this.value.learningTime);

            $mdDialog.show({
                locals: {selectedWebsite: $scope.selectedWebsite},
                controller: DialogEditController,
                templateUrl: 'components/course/editCourseTemplate.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: true
            })
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

        function DialogAddController($scope, $mdDialog, allCourseList) {
            $scope.addedCourse = {}
            $scope.newList = allCourseList;
            var toastSuccess = $mdToast.simple()
            .textContent('Success To Add New Course.')
            .position('right bottom');

            var toastFail = $mdToast.simple()
            .textContent('Failed To Add New Course.')
            .position('right bottom');

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.onRequest = false;

            $scope.add = function () {
                if(auth.isAuthed()) {
                    console.log($scope.addedCourse)
                    $scope.onRequest = true;
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl+':81/courses/',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            id: $scope.addedCourse.id,
                            name: $scope.addedCourse.name,
                            cost: $scope.addedCourse.cost,
                            requirements: $scope.addedCourse.requirements,
                            active: $scope.addedCourse.active
                        }
                    }).success(function (response) {
                        $scope.onRequest = false;
                        $mdDialog.hide();
                        $scope.websiteModal = {};
                        console.log(data)
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $scope.onRequest = false;
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