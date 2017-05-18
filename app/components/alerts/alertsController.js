/**
 * Created by sonsi_000 on 6/27/2016.
 */

angular.module('webix')

    .controller('studentController',function ($scope,$rootScope,$http,auth,$interval,$timeout,$state,webNotification,searchQueryAlert,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            /*Get Alerts*/
            $scope.alerts =[];
            $scope.totalAlerts = 0 ;
            $scope.totalItems = 0;

            webNotification.allowRequest = true;
            $scope.queryAlert = {data:""};
            $scope.queryAlert.data = searchQueryAlert.getSearchQueryAlert();
            $scope.$watch("queryAlert.data", function (newValue, oldValue) {
                if (newValue !== oldValue) searchQueryAlert.setQueryAlert(newValue);
            },true);

            $scope.refresh_alert = refresh_alert;
            $scope.getLoadResultsCallback = getLoadResultsCallback;
            var loadPageCallbackWithDebounce;

            $scope.$watch('queryAlert.data', function(){
                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            });

            function getLoadResultsCallback(loadPageCallback){
                loadPageCallbackWithDebounce = _.debounce(loadPageCallback, 1000);
            }

            function refresh_alert(page, pageSize) {
                if (auth.isAuthed()) {
                    page = typeof page !== 'undefined' ? page : 1;
                    $scope.page = page;
                    $scope.pageSize = pageSize;
                    page =(page-1)*pageSize;
                    if ($scope.queryAlert.data !== "" || $scope.severity !== "" || $scope.is_alerted.length !== "") {
                        return $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/get_alerts/from/' + page + '/size/' + pageSize,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                userQuery: $scope.queryAlert.data,
                                field : $scope.field.value,
                                order_type : $scope.order_type,
                                severity: $scope.severity,
                                is_alerted: $scope.is_alerted
                            }
                        }).then(function(response){
                            $scope.count = response.data.count;
                            return {
                                results: response.data.result,
                                totalResultCount: response.data.count
                            }
                        })
                    } else {
                        return $http.get($rootScope.apiUrl + '/students/?limit=' + pageSize +'&offset=' + page )
                            .then(function (response) {
                                $scope.count = response.data.count;
                                return {
                                    results: response.data.result,
                                    totalResultCount: response.data.count
                                }
                            });
                    }
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            }


            $scope.searchAlert = function() {
                refresh_alert(1,5);
                console.log($scope.queryAlert);
            };

            // var stopRefreshAlert = $interval(function () {
            //     refresh_alert(1, 5);
            // },1000*60);
            // var changeRoute = $rootScope.$on('$locationChangeSuccess', function() {
            //     $interval.cancel(stopRefreshAlert);
            //     $state.reload();
            //     changeRoute();
            // });

            $scope.showDetail = function (value) {
                if(auth.isAuthed()) {
                    console.log(value);
                    $mdDialog.show({
                        controller: DialogDetailController,
                        locals: {value: value,
                            state: $state},
                        templateUrl: 'components/alerts/detailAlertTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogDetailController($scope, $mdDialog, value, state) {

                $scope.state = state;
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                var getDetailInfo = function (page, size) {
                    page =(page-1)*10;
                    $scope.selectedAlert = {
                        info : []
                    };

                    $scope.totalRecord = 0 ;
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/get_detail_alert/from/' + page + '/size/' + size,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            _id: value
                        }
                    }).success(function (response) {
                        $scope.totalRecord = response.count;
                        $scope.selectedAlert = response.result;
                        $scope.selectedAlert.info = response.detail;
                    });
                };

                $scope.pageChanged = function(newPage){
                    if (auth.isAuthed()){
                        getDetailInfo(newPage, 10);
                    } else {
                        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                        auth.logout();
                    }

                };

                $scope.pagination = {
                    current: 1
                };
                getDetailInfo(1,10);

                $scope.openReportModal = function () {
                    if(auth.isAuthed()) {
                        var confirm = $mdDialog.confirm()
                            .title('BÁO CÁO CẢNH BÁO SAI')
                            .textContent('Bạn có chắc chắn muốn báo cáo cảnh báo đã chọn ?')
                            .ariaLabel('Báo cáo Cảnh báo sai')
                            .ok('Xác nhận')
                            .cancel('Hủy bỏ');

                        $mdDialog.show(confirm).then(function() {
                            $http({
                                method: 'POST',
                                url: $rootScope.apiUrl + '/update_alerts',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: {
                                    _id: value
                                }
                            }).success(function(response){
                                if (response['result']) {
                                    $mdToast.show(toastSuccess);
                                    // refresh_alert(1, $scope.pageSize);
                                    $state.reload();
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
                $scope.openDoneModal = function () {
                    if(auth.isAuthed()) {
                        var confirm = $mdDialog.confirm()
                            .title('XỬ LÝ CẢNH BÁO')
                            .textContent('Xác nhận xử lý Cảnh báo đã chọn ?')
                            .ariaLabel('doneAlert')
                            .ok('Xác nhận')
                            .cancel('Hủy bỏ');

                        $mdDialog.show(confirm).then(function() {
                            $http({
                                method: 'POST',
                                url: $rootScope.apiUrl + '/done_alerts',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: {
                                    _id: value
                                }
                            }).success(function(response){
                                if (response['result']) {
                                    $mdToast.show(toastDoneSuccess);
                                    $state.reload();
                                } else {
                                    $mdToast.show(toastDoneFail);
                                }
                            }).error(function () {
                                $mdToast.show(toastDoneFail);
                            })
                        }, function() {
                        });
                    } else {
                        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                        auth.logout();
                    }
                };
            }

            /*report wrong alert function*/
            $scope.alertList = {
                id: []
            };

            $scope.selectedRowCallback = function(rows){
                $scope.alertList.id = rows;
            };

            var toastSuccess = $mdToast.simple()
                .textContent('Báo cáo Cảnh báo Sai thành công')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Báo cáo Cảnh báo Sai thất bại')
                .position('right bottom');

            var toastDoneSuccess = $mdToast.simple()
                .textContent('Cảnh báo đã được Xử lý thành công')
                .position('right bottom');

            var toastDoneFail = $mdToast.simple()
                .textContent('Cảnh báo đã được Xử lý thất bại')
                .position('right bottom');

            $scope.openReportModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('BÁO CÁO CẢNH BÁO SAI')
                        .textContent('Bạn có chắc chắn muốn báo cáo cảnh báo đã chọn ?')
                        .ariaLabel('Báo cáo Cảnh báo sai')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/update_alerts',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id:$scope.alertList.id
                            }
                        }).success(function(response){
                            if (response['result']) {
                                $mdToast.show(toastSuccess);
                                // refresh_alert(1, $scope.pageSize);
                                $state.reload();
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

            $scope.openDoneModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('XỬ LÝ CẢNH BÁO')
                        .textContent('Xác nhận xử lý Cảnh báo đã chọn ?')
                        .ariaLabel('doneAlert')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/done_alerts',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id:$scope.alertList.id
                            }
                        }).success(function(response){
                            if (response['result']) {
                                $mdToast.show(toastDoneSuccess);
                                $state.reload();
                            } else {
                                $mdToast.show(toastDoneFail);
                            }
                        }).error(function () {
                            $mdToast.show(toastDoneFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            // filter and sort button
            $scope.order_type = "-1";
            $scope.field = { id:1, name: 'Thời gian', value: 'update_at'};
            $scope.valueFilters = [
                { category: 'severity', name: 'Cao', value: 3 },
                { category: 'severity', name: 'Trung bình',value: 2 },
                { category: 'severity', name: 'Thấp', value: 1 },
                { category: 'is_alerted', name: 'Đã gửi', value: 1 },
                { category: 'is_alerted', name: 'Chưa gửi', value: 0 },
                { category: 'is_alerted', name: 'Không gửi được', value: -1 }
            ];
            $scope.fieldValues = [
                { id:1, name: 'Thời gian', value: 'update_at'},
                { id:2, name: 'Tên cảnh báo', value: 'name'},
                { id:3, name: 'Đối tượng ảnh hưởng', value: '_type'},
                { id:4, name: 'Mức độ', value: 'severity'},
                { id:5, name: 'Gửi cảnh báo', value: 'is_alerted'}
            ];

            $scope.selectedFilter = [];

            $scope.$watch('selectedFilter', function(){
                if($scope.selectedFilter.length == 0) {
                    $scope.severity = "null";
                    $scope.is_alerted = "null";
                } else {
                    $scope.severity = [];
                    $scope.is_alerted = [];
                    angular.forEach($scope.selectedFilter, function (value) {
                        if(value.category == "severity") {
                            $scope.severity.push(value.value);
                        } else {
                            $scope.is_alerted.push(value.value);
                        }
                        if($scope.severity.length == 0) {
                            $scope.severity = "null";
                        }
                        if($scope.is_alerted.length == 0) {
                            $scope.is_alerted = "null";
                        }
                    })
                }

                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            });
            $scope.$watch('order_type', function(){
                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            });
            $scope.$watch('field', function(){
                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            });

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
