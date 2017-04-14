angular.module('webix')

    .controller('managementsController',function ($scope,$rootScope,$http,auth,$sce,$mdDialog,$mdToast,$timeout) {
        /*User management*/
        if(auth.isAuthed()) {
            $scope.users = [];

            var refresh = function () {
                $scope.loadingTableUser = true;
                $http.get($rootScope.apiUrl + '/users')
                    .success(function (response) {
                        $scope.users = response;
                        $scope.loadingTableUser = false;
                    })
                    .error(function () {
                        $timeout(function() {
                            angular.element("li:last a").trigger('click');
                        },0);
                    })
            };
            refresh();

            $scope.addUserModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {groups: $scope.groups},
                        controller: DialogAddController,
                        templateUrl: 'components/managements/users/addUserTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            function DialogAddController($scope, $mdDialog, groups) {
                var toastSuccess = $mdToast.simple()
                    .textContent('Thêm Người dùng thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Thêm Người dùng thất bại')
                    .position('right bottom');

                var toastExist = $mdToast.simple()
                    .textContent('Đã tồn tại Username hoặc Email')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;
                $scope.groups = groups;
                $scope.userModal = {
                    password: "",
                    password2: ""
                };

                $scope.$watch('userModal.password2',function (newValue) {
                    if($scope.addUser.password.$valid && $scope.userModal.password != newValue) {
                        $scope.addUser.password2.$error = {'notMatch': true};
                        // $scope.addUser.$invalid = true;
                        // $scope.addUser.$valid = false;
                        $scope.addUser.password2.$invalid = true;
                        $scope.addUser.password2.$valid = false;
                    } else {
                        $scope.addUser.password2.$error = {};
                        // $scope.addUser.$invalid = false;
                        // $scope.addUser.$valid = true;
                        $scope.addUser.password2.$invalid = false;
                        $scope.addUser.password2.$valid = true;
                    }
                });

                $scope.add = function () {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/create_user',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            username: $scope.userModal.username,
                            name: $scope.userModal.name,
                            email: $scope.userModal.email,
                            password: $scope.userModal.password,
                            groupid: $scope.userModal.groupid
                        }
                    }).success(function (response) {
                        if(response['result']) {
                            $mdToast.show(toastSuccess);
                            $mdDialog.hide();
                            refresh();
                        }
                        if(!response['result'] && response['reason'] == "exist") {
                            $mdToast.show(toastExist);
                        }
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                    })
                };
            }

            $scope.editUserModal = function (id) {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {id: id, groups: $scope.groups},
                        controller: DialogEditController,
                        templateUrl: 'components/managements/users/editUserTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            function DialogEditController($scope, $mdDialog, groups, id) {
                var toastSuccess = $mdToast.simple()
                    .textContent('Chỉnh sửa Người dùng thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Chỉnh sửa Người dùng thất bại')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $http.get($rootScope.apiUrl + '/user/' + id).success(function (response) {
                    $scope.userModal = response;
                });

                $scope.onRequest = true;
                $scope.groups = groups;

                $scope.edit = function () {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_user/' + id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            name: $scope.userModal.name,
                            email: $scope.userModal.email,
                            groupid: $scope.userModal.group.id
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
                }
            }


            $scope.deleteUserModal = function (value) {
                if(auth.isAuthed()) {
                    var toastDeleteUserSuccess = $mdToast.simple()
                        .textContent('Xóa Người dùng thành công')
                        .position('right bottom');

                    var toastDeleteUserFail = $mdToast.simple()
                        .textContent('Xóa Người dùng thất bại')
                        .position('right bottom');

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa Tài khoản này ?')
                        .textContent('Toàn bộ dữ liệu liên quan tới Tài khoản sẽ bị xóa.')
                        .ariaLabel('Delete User')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.delete($rootScope.apiUrl + '/delete_user/'+ value )
                            .success(function(response){
                                if (response.length) {
                                    $mdToast.show(toastDeleteUserSuccess);
                                    refresh();
                                } else {
                                    $mdToast.show(toastDeleteUserFail);
                                }
                            }).error(function () {
                            $mdToast.show(toastDeleteUserFail);
                        })

                    }, function() {
                    });

                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.resetUserModal = function (value) {
                if(auth.isAuthed()) {
                    var toastResetUserSuccess = $mdToast.simple()
                        .textContent('Đặt lại mật khẩu thành công')
                        .position('right bottom');

                    var toastResetUserFail = $mdToast.simple()
                        .textContent('Đặt lại mật khẩu thất bại')
                        .position('right bottom');

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa Đặt lại mật khẩu cho tài khoản này ?')
                        .textContent('Mật khẩu của tài khoản sẽ được đặt lại thành giá trị mặc định (12345678a)')
                        .ariaLabel('Reset User')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.get($rootScope.apiUrl + '/reset_password/'+ value )
                            .success(function(response){
                                if (response['result']) {
                                    $mdToast.show(toastResetUserSuccess);
                                    refresh();
                                } else {
                                    $mdToast.show(toastResetUserFail);
                                }
                            }).error(function () {
                            $mdToast.show(toastResetUserFail);
                        })

                    }, function() {
                    });

                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.lockUserModal = function (value) {
                if(auth.isAuthed()) {
                    var toastLockUserSuccess = $mdToast.simple()
                        .textContent('Khóa/Mở tài khoản thành công')
                        .position('right bottom');

                    var toastLockUserFail = $mdToast.simple()
                        .textContent('Khóa/Mở tài khoản thất bại')
                        .position('right bottom');

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn Khóa/Mở tài khoản này ?')
                        .textContent('')
                        .ariaLabel('Lock/Unlock User')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.get($rootScope.apiUrl + '/lock_user/'+ value )
                            .success(function(response){
                                if (response['result']) {
                                    $mdToast.show(toastLockUserSuccess);
                                    refresh();
                                } else {
                                    $mdToast.show(toastLockUserFail);
                                }
                            }).error(function () {
                            $mdToast.show(toastLockUserFail);
                        })

                    }, function() {
                    });

                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            /*end User management*/

            /*Group management*/

            $scope.groups = [];

            var refresh1 = function () {
                $scope.loadingTableGroup = true;
                $http.get($rootScope.apiUrl + '/groups').success(function (response) {
                    $scope.groups = response;
                    $scope.loadingTableGroup = false;
                })
            };
            refresh1();

            $scope.editGroupModal = function (id) {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {id: id},
                        controller: DialogEditGroupController,
                        templateUrl: 'components/managements/groups/editGroupTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            function DialogEditGroupController($scope, $mdDialog, id) {
                var toastSuccess = $mdToast.simple()
                    .textContent('Chỉnh sửa Nhóm thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Chỉnh sửa Nhóm thất bại')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $http.get($rootScope.apiUrl + '/group/' + id)
                    .success(function (response) {
                        $scope.groupModal = response;
                    });

                $scope.onRequest = true;

                $scope.edit = function () {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_group/' + id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            name: $scope.groupModal.name,
                            description: $scope.groupModal.description
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if(response['result']) {
                            $mdToast.show(toastSuccess);
                            refresh1();
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                    })
                };
            }

            $scope.addGroupModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        controller: DialogAddGroupController,
                        templateUrl: 'components/managements/groups/addGroupTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            function DialogAddGroupController($scope, $mdDialog) {
                var toastSuccess = $mdToast.simple()
                    .textContent('Thêm Nhóm thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Thêm Nhóm thất bại')
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
                        url: $rootScope.apiUrl + '/create_group',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            name: $scope.groupModal.name,
                            description: $scope.groupModal.description
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                        } else {
                            $mdToast.show(toastFail);
                        }
                        refresh1();
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                    })
                };
            }

            $scope.deleteGroupModal = function (value) {
                if(auth.isAuthed()) {
                    var toastDeleteGroupSuccess = $mdToast.simple()
                        .textContent('Xóa Nhóm thành công')
                        .position('right bottom');

                    var toastDeleteGroupFail = $mdToast.simple()
                        .textContent('Xóa Nhóm thất bại')
                        .position('right bottom');

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa Nhóm này ?')
                        .textContent('Toàn bộ dữ liệu liên quan tới Nhóm sẽ bị xóa.')
                        .ariaLabel('Delete Group')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.delete($rootScope.apiUrl + '/delete_group/' + value)
                            .success(function(response){
                                if (response['result']) {
                                    $mdToast.show(toastDeleteGroupSuccess);
                                    refresh1();
                                } else {
                                    $mdToast.show(toastDeleteGroupFail);
                                }
                            }).error(function () {
                            $mdToast.show(toastDeleteGroupFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            /*end Group management*/

            /*Permission management*/
            $scope.controllers = [];
            $scope.permissions = [];
            $scope.loadingTablePermission = true;
            var refresh2 = function () {
                $http.get($rootScope.apiUrl + '/permissions')
                    .success(function (response) {
                        $scope.loadingTablePermission = false;
                        $scope.permissions = response['permissions'];
                        $scope.controllers = response['controllers'];
                        $scope.checkPermission = function (id, permissionArray) {
                            for (var i = 0; i < permissionArray.length; i++) {
                                if (id == permissionArray[i]) {
                                    return $sce.trustAsHtml('<i class="fa fa-check fa-2x" style="color: green;"></i>');
                                }
                            }
                            return $sce.trustAsHtml('<i class="fa fa-times fa-2x" style="color: red;"></i>');
                        };
                    })
                };
            refresh2();


            $scope.changePermission = function (controllerid, groupid) {
                if(auth.isAuthed()) {
                    var toastChangePermissionSuccess = $mdToast.simple()
                        .textContent('Cập nhật quyền thành công')
                        .position('right bottom');

                    var toastChangePermissionFail = $mdToast.simple()
                        .textContent('Cập nhật quyền thất bại')
                        .position('right bottom');

                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn thay đổi quyền cho nhóm người dùng này ?')
                        .textContent('Người dùng thuộc nhóm sẽ được cấp quyền')
                        .ariaLabel('changePermission')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $scope.loadingTablePermission = true;
                        $http.post($rootScope.apiUrl + '/change_permissions/'+groupid+'/'+controllerid)
                            .success(function (response) {
                                if(response['result']){
                                    $mdToast.show(toastChangePermissionSuccess);
                                    $scope.loadingTablePermission = false;
                                    refresh2();
                                } else {
                                    $mdToast.show(toastChangePermissionFail);
                                }
                            })
                            .error(function () {
                                $mdToast.show(toastChangePermissionFail);
                        })
                    }, function() {
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            /*Config system*/

            var refresh3 = function () {
                $http.get($rootScope.apiUrl + '/get_settings')
                    .success(function (response) {
                        $scope.emailConfig = response[0];
                        $scope.rotation = response[1];
                        $scope.database = response[2];
                    });
            };
            refresh3();
            
            $scope.saveEmailConfig = function () {
                if(auth.isAuthed()) {
                    var toastEmailConfigSuccess = $mdToast.simple()
                        .textContent('Cập nhật cấu hình gửi cảnh báo thành công')
                        .position('right bottom');

                    var toastEmailConfigFail = $mdToast.simple()
                        .textContent('Cập nhật cấu hình gửi cảnh báo thất bại')
                        .position('right bottom');

                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_email_config',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            username : $scope.emailConfig.username,
                            password : $scope.emailConfig.password,
                            server_name : $scope.emailConfig.server,
                            port : $scope.emailConfig.port,
                            encryption : $scope.emailConfig.encryption,
                            subject	: $scope.emailConfig.subject,
                            name : $scope.emailConfig.name,
                            body : $scope.emailConfig.body,
                            severity : $scope.emailConfig.severity
                        }
                    }).success(function (response) {
                        if (response['result']) {
                            $mdToast.show(toastEmailConfigSuccess);
                            refresh3();
                        } else {
                            $mdToast.show(toastEmailConfigFail);
                        }
                    }).error(function () {
                        $mdToast.show(toastEmailConfigFail);
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            $scope.saveRotationConfig = function () {
                if(auth.isAuthed()) {
                    var toastRotationConfigSuccess = $mdToast.simple()
                        .textContent('Cập nhật cấu hình rotation thành công')
                        .position('right bottom');

                    var toastRotationConfigFail = $mdToast.simple()
                        .textContent('Cập nhật cấu hình rotation thất bại')
                        .position('right bottom');

                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_rotation_config',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            max_log_per_day_per_agent : $scope.rotation.max_log_per_day_per_agent,
                            log_rotation_time : $scope.rotation.log_rotation_time,
                            max_res_in_alert : $scope.rotation.max_res_in_alert,
                            webchecker_rotation_time : $scope.rotation.webchecker_rotation_time
                        }
                    }).success(function (response) {
                        if (response['result']) {
                            $mdToast.show(toastRotationConfigSuccess);
                            refresh3();
                        } else {
                            $mdToast.show(toastRotationConfigFail);
                        }
                    }).error(function () {
                        $mdToast.show(toastRotationConfigFail);
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            $scope.saveDbConfig = function () {
                if(auth.isAuthed()) {
                    var toastDbConfigSuccess = $mdToast.simple()
                        .textContent('Cập nhật cấu hình cơ sở dữ liệu thành công')
                        .position('right bottom');

                    var toastDbConfigFail = $mdToast.simple()
                        .textContent('Cập nhật cấu hình cơ sở dữ liệu thất bại')
                        .position('right bottom');

                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_db_config',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            es_ip: $scope.database.es_ip,
                            es_port: $scope.database.es_port
                        }
                    }).success(function (response) {
                        if (response['result']) {
                            $mdToast.show(toastDbConfigSuccess);
                            refresh3();
                        } else {
                            $mdToast.show(toastDbConfigFail);
                        }
                    }).error(function () {
                        $mdToast.show(toastDbConfigFail);
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

        }  else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    });