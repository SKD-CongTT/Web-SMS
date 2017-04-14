/**
 * Created by sonsi_000 on 12/14/2016.
 */

angular.module('webix')
    .controller('negativeController',function ($scope,$rootScope,$http,auth,$interval,$state,webNotification,searchQueryAlert,$mdToast,$mdDialog) {
        if(auth.isAuthed()){

            /*Get wrong alert*/
            $scope.wrong_alerts =[];
            var refresh_wrong_alert = function () {
                $http.get($rootScope.apiUrl + '/get_wrong_alerts').success(function (response) {
                    $scope.wrong_alerts = response;
                    $scope.loadingWrongTable = false;
                });
            };
            refresh_wrong_alert();

            $scope.showDetail = function (value) {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        controller: DialogDetailController,
                        locals: {value: value,state: $state},
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
                        console.log($scope.selectedAlert);
                    });
                };

                $scope.pageChanged = function(newPage){
                    if (auth.isAuthed()){
                        getDetailInfo(newPage);
                    } else {
                        alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                        auth.logout();
                    }

                };

                $scope.pagination = {
                    current: 1
                };
                getDetailInfo(1,10);

                var toastDoneSuccess = $mdToast.simple()
                    .textContent('Cảnh báo đã được Xử lý thành công')
                    .position('right bottom');

                var toastDoneFail = $mdToast.simple()
                    .textContent('Cảnh báo đã được Xử lý thất bại')
                    .position('right bottom');

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

            /*restore or delete selected wrong alert function*/
            $scope.alertList = {
                id: []
            };

            $scope.selectedRowCallback = function(rows){
                $scope.alertList.id = rows;
            };

            var toastRestoreSuccess = $mdToast.simple()
                .textContent('Khôi phục Cảnh báo thành công')
                .position('right bottom');

            var toastRestoreFail = $mdToast.simple()
                .textContent('Khôi phục Cảnh báo thất bại')
                .position('right bottom');

            var toastDeleteSuccess = $mdToast.simple()
                .textContent('Xóa Cảnh báo thành công')
                .position('right bottom');

            var toastDeleteFail = $mdToast.simple()
                .textContent('Xóa Cảnh báo thất bại')
                .position('right bottom');

            $scope.openRestoreModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('KHÔI PHỤC CẢNH BÁO')
                        .textContent('Bạn có chắc chắn muốn khôi phục Cảnh báo đã chọn ?')
                        .ariaLabel('restoreAlert')
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
                                $mdToast.show(toastRestoreSuccess);
                                $state.reload();
                            } else {
                                $mdToast.show(toastRestoreFail);
                            }
                        }).error(function () {
                            $mdToast.show(toastRestoreFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.openDeleteModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('XÓA CẢNH BÁO SAI')
                        .textContent('Bạn có chắc chắn muốn xóa Cảnh báo đã chọn ?')
                        .ariaLabel('deleteAlert')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/delete_alert',
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
                                $mdToast.show(toastDeleteSuccess);
                                $state.reload();
                            } else {
                                $mdToast.show(toastDeleteFail);
                            }
                        }).error(function () {
                            $mdToast.show(toastDeleteFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
