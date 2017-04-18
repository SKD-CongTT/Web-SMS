angular.module('webix')

    .controller('courseController',function ($scope,$rootScope,$http,$mdToast,auth,$timeout,$mdDialog) {
        if(auth.isAuthed()) {
            $scope.webList = [];

            $scope.isNumber = angular.isNumber;
            $scope.panelResult = [
                {
                    name : "Status",
                    info : ""
                },{
                    name: "Credits",
                    info: ""
                }];

            $scope.chartConfig = {};
            $scope.countChartConfig = {};
            $scope.loadingWebList = false;
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
                            url: $rootScope.apiUrl + ':81/courses/' + $scope.courseInfo.id + "/",
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
                                description: $scope.courseInfo.description,
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
            var getCourseInfo = function (page) {
                if (auth.isAuthed()){
                    return new Promise(function(resolve, reject) {
                        $http.get($rootScope.apiUrl + ':81/courses/')
                            .then(function (response) {
                                console.log(response)
                                $scope.loadingWebList = false;
                                if(response.data.results !== false) {
                                    $scope.webList = response.data.results;
                                    $scope.count = response.data.count;
                                    $scope.itemRemain = $scope.count - 10;
                                    console.log($scope.count);
                                    resolve();
                                } else {
                                    $scope.webList = [];
                                    reject();
                                }
                            })
                    })
                }
            };
            $scope.select = function (value){
                $scope.selectedCourse = value;
                if (value.active)
                    $scope.selectedCourse.status = "Opening";
                else
                    $scope.selectedCourse.status = "Closed";
            }
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
                            $scope.webSearchList = [];
                        } else {
                            $scope.webSearchList = response['result'];
                        }
                    }).error(function () {
                        $scope.webSearchList = [];
                        
                        // console.log(response);
                    })
                }

            };

            getCourseInfo(0);


            var page = 0;
            $scope.itemRemain = 0;
            $scope.hasMoreItemsToShow = function() {
                //server return 10 items each request
                return page < ($scope.count);
            };

            $scope.showMoreItems = function() {
                page = page + 10;
                $scope.itemRemain -= 10;
                $scope.page = page;
                $http.get($rootScope.apiUrl+':81/courses/?offset='+page)
                    .success(function (response) {
                        $scope.loadingWebList = false;
                        console.log(response);

                        if(response.results !== false) {
                            $scope.webList = $scope.webList.concat(response.results);
                        }
                    })
            };


            $scope.selectWebsite = function (id,hostName) {
                $scope.loadingChart = true;
                $scope.loadingChartPie = true;
                // $scope.loadingTable = true;
                $scope.selectedRange = 0;
                
            };

            $scope.addCourseModal = function () {
                if(auth.isAuthed()) {
                    console.log(1)
                    $mdDialog.show({
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

            $scope.deleteWebsiteModal = function (value) {
                if(auth.isAuthed()) {
                    $scope.selectedWebsite = angular.copy(this.value);

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa Website ' + $scope.selectedWebsite.hostName+ ' ?')
                        .textContent('Toàn bộ dữ liệu theo dõi Website này sẽ bị xóa')
                        .ariaLabel('Delete Websie')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.delete($rootScope.apiUrl + '/delete_website/'+ value.id )
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

            function DialogAddController($scope, $mdDialog) {

                var toastSuccess = $mdToast.simple()
                    .textContent('Success To Add New Course.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Failed To Add New Course.')
                    .position('right bottom');

                $scope.websiteModal = {
                    hostName:"",
                    port: 80,
                    protocol: "http",
                    time: 30
                };

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = false;

                $scope.add = function () {
                    if(auth.isAuthed()) {
                        $scope.onRequest = true;
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl+"/add_website",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                hostName: $scope.websiteModal.hostName,
                                port: $scope.websiteModal.port,
                                protocol: $scope.websiteModal.protocol,
                                id: $scope.websiteModal.id,
                                learningTime: $scope.websiteModal.time
                            }
                        }).success(function (response) {
                            $scope.onRequest = false;
                            $mdDialog.hide();
                            $scope.websiteModal = {};
                            if (response['result']) {
                                $mdToast.show(toastSuccess);
                                getCourseInfo(0);
                                getVisualization();
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