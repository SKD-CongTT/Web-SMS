/**
 * Created by sonsi_000 on 12/14/2016.
 */
/**
 * Created by sonsi_000 on 6/27/2016.
 */

angular.module('webix')
    .controller('rulesController',function ($scope,$rootScope,$http,auth,$mdToast,$mdDialog) {
        if(auth.isAuthed()){

            var toastDisableSuccess = $mdToast.simple()
                .textContent('Vô hiệu hóa Bộ nhận dạng thành công')
                .position('right bottom');

            var toastDisableFail = $mdToast.simple()
                .textContent('Vô hiệu hóa Bộ nhận dạng thất bại')
                .position('right bottom');

            var toastEnableSuccess = $mdToast.simple()
                .textContent('Kích hoạt Bộ nhận dạng thành công')
                .position('right bottom');

            var toastEnableFail = $mdToast.simple()
                .textContent('Kích hoạt Bộ nhận dạng thất bại')
                .position('right bottom');

            var toastDeleteSuccess = $mdToast.simple()
                .textContent('Xóa Bộ nhận dạng thành công')
                .position('right bottom');

            var toastDeleteFail = $mdToast.simple()
                .textContent('Xóa Bộ nhận dạng thất bại')
                .position('right bottom');

            /*Active Rules*/
            var get_active_rules = function () {
                $http.get($rootScope.apiUrl + '/get_active_rules').success(function (response) {
                    $scope.activeLists = response;
                    $scope.loading = false;
                })
            };
            get_active_rules();

            $scope.selectedActiveRules = {
                id: []
            };

            $scope.selectedActiveRulesCallback = function(rows){
                $scope.selectedActiveRules.id = rows;
            };

            $scope.openDisableModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('VÔ HIỆU HÓA BỘ NHẬN DẠNG')
                        .textContent('Bạn có chắc chắn muốn vô hiệu hóa Bộ nhận dạng đã chọn ?')
                        .ariaLabel('disableRule')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/update_status_rule',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id: $scope.selectedActiveRules.id
                            }
                        }).success(function (response) {
                            if (response['result']) {
                                $mdToast.show(toastDisableSuccess);
                            } else {
                                $mdToast.show(toastDisableFail);
                            }
                            get_active_rules();
                            get_inactive_rules();
                        }).error(function () {
                            $mdToast.show(toastDisableFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            /*Get Inactive Rules*/
            var get_inactive_rules = function () {
                $http.get($rootScope.apiUrl + '/get_inactive_rules').success(function (response) {
                    $scope.inactiveLists = response;
                    $scope.loading = false;
                });
            };
            get_inactive_rules();

            $scope.selectedInactiveRules = {
                id: []
            };

            $scope.selectedInactiveRulesCallback = function(rows){
                $scope.selectedInactiveRules.id = rows;
            };

            $scope.openEnableModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('KÍCH HOẠT BỘ NHẬN DẠNG')
                        .textContent('Bạn có chắc chắn muốn kích hoạt Bộ nhận dạng đã chọn ?')
                        .ariaLabel('disableRule')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/update_status_rule',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id: $scope.selectedInactiveRules.id
                            }
                        }).success(function (response) {
                            if (response['result']) {
                                $mdToast.show(toastEnableSuccess);
                            } else {
                                $mdToast.show(toastEnableFail);
                            }
                            get_active_rules();
                            get_inactive_rules();
                        }).error(function () {
                            $mdToast.show(toastEnableFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            /*Custom Rules*/
            var get_custom_rules = function () {
                $http.get($rootScope.apiUrl + '/get_custom_rules').success(function (response) {
                    $scope.customLists = response;
                    $scope.loading = false;
                });
            };
            get_custom_rules();

            $scope.selectedCustomRules = {
                id: []
            };

            $scope.selectedCustomRulesCallback = function(rows){
                $scope.selectedCustomRules.id = rows;
            };

            $scope.openDeleteModal = function () {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('XÓA BỘ NHẬN DẠNG')
                        .textContent('Bạn có chắc chắn muốn xóa Bộ nhận dạng đã chọn ?')
                        .ariaLabel('deleteCustomRule')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/delete_custom_rule',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id: $scope.selectedCustomRules.id
                            }
                        }).success(function (response) {
                            if (response['result']) {
                                $mdToast.show(toastDeleteSuccess);
                            } else {
                                $mdToast.show(toastDeleteFail);
                            }
                            get_custom_rules();
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

            /*Edit Rule function*/
            $scope.editRuleModal = function (value) {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {
                            value: value
                        },
                        controller: DialogEditController,
                        templateUrl: 'components/alerts/rules/editRuleTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogEditController($scope, $mdDialog, $mdToast, value) {

                var toastSuccess = $mdToast.simple()
                    .textContent('Cập nhật Bộ nhận dạng thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Cập nhật Bộ nhận dạng thất bại')
                    .position('right bottom');

                $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + '/post_custom_rules',
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
                    $scope.selectedRule = response;
                    console.log($scope.selectedRule);
                }).error(function () {
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                $scope.edit = function () {
                    if(auth.isAuthed()) {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/update_custom_rule',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                _id:$scope.selectedRule._id.$id,
                                name: $scope.selectedRule.name,
                                severity: $scope.selectedRule.severity,
                                rule_query: $scope.selectedRule.query,
                                tag_description: $scope.selectedRule.tag_description,
                                enabled: $scope.selectedRule.enabled
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            if (response['result']) {
                                $mdToast.show(toastSuccess);
                                get_custom_rules();
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
                }
            }

            $scope.updateStatusRule = function () {
                $scope.selectedRule = angular.copy(this.r);
                $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + '/update_status_rule',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        _id:$scope.selectedRule._id.$id
                    }
                }).success(function (response) {
                    if (response['result']) {
                        $('#editModal').modal('hide');
                        Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Thay đổi trạng thái bộ nhận dạng thành công', positionX: 'center', delay: 3000});
                    } else {
                        $('#editModal').modal('hide');
                        Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi trạng thái bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
                    }
                    refresh();
                }).error(function () {
                    $('#editModal').modal('hide');
                    Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi trạng thái bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
                })
            };

            $scope.deleteRuleModal = function () {
                $scope.selectedRule = angular.copy(this.r);
                $('#deleteModal').modal('show');
            };

            $scope.deleteRule = function () {
                $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + '/delete_rule',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        _id:$scope.selectedRule._id.$id
                    }
                })
                    .success(function (response) {
                        if (response['result']) {
                            Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Xóa bộ nhận dạng thành công', positionX: 'center', delay: 3000});
                        } else {
                            Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
                        }
                        refresh();
                    }).error(function () {
                    Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
                })
            };

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
