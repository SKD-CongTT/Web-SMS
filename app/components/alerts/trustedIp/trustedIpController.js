/**
 * Created by sonsi_000 on 12/16/2016.
 */

angular.module('webix')

    .controller('trustedIpController',function ($scope,$rootScope,$http,auth,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            /*Ip table*/
            var refresh = function () {
                $http.get($rootScope.apiUrl + '/get_trusted_ip')
                    .success(function (response) {
                        if(response['result']) {
                            $scope.ips = response['trusted_ip'];
                            $scope.loadingTableIp = false;
                        } else {
                            $scope.loadingTableIp = false;
                            $scope.ips =[];
                        }
                    });
            };

            refresh();

            $scope.ipLists = {
                id : []
            };

            $scope.selectedRowCallback = function(rows){
                $scope.ipLists.id = rows;
            };


            var toastSuccess = $mdToast.simple()
                .textContent('Xóa Địa chỉ IP tin cậy thành công')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Xóa Địa chỉ IP tin cậy thất bại')
                .position('right bottom');

            $scope.deleteIpModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa địa chỉ IP này ?')
                        .textContent('Toàn bộ dữ liệu liên quan tới địa chỉ IP sẽ bị xóa.')
                        .ariaLabel('Delete Sensor')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/remove_trusted_ip' ,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                trusted_ip: $scope.ipLists.id
                            }
                        }).success(function(response){
                            if (response['result']) {
                                $mdToast.show(toastSuccess);
                            } else {
                                $mdToast.show(toastFail);
                            }
                            refresh();
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

            $scope.addIpModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        controller: DialogAddController,
                        templateUrl: 'components/alerts/trustedIp/addTrustedIpTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogAddController($scope, $mdDialog) {
                var toastSuccess = $mdToast.simple()
                    .textContent('Thêm Địa chỉ IP tin cậy thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Thêm Địa chỉ IP tin cậy thất bại')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                $scope.add = function () {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/create_trusted_ip' ,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            trusted_ip: $scope.ipAddress
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                            refresh();
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $mdToast.show(toastFail);
                    })
                };
            }

            $scope.editIpModal = function (value) {
                if(auth.isAuthed()) {

                    $mdDialog.show({
                        locals: {value : value},
                        controller: DialogEditController,
                        templateUrl: 'components/alerts/trustedIp/editTrustedIpTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogEditController($scope, $mdDialog, value) {

                var toastSuccess = $mdToast.simple()
                    .textContent('Cập nhật Địa chỉ IP tin cậy thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Cập nhật Địa chỉ IP tin cậy thất bại')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                $http.get($rootScope.apiUrl + '/get_trusted_ip/' + value)
                    .success(function (response) {
                        if(response['result']) {
                            $scope.ipAddress = response['trusted_ip'];
                        }
                    });

                $scope.edit = function () {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_trusted_ip/' + value,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            trusted_ip: $scope.ipAddress
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                            refresh();
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $mdToast.show(toastFail);
                    })
                }
            }
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
