angular.module('webix')

    .controller('profileController',function ($scope,$state,auth,$rootScope,$http,$mdDialog,$mdToast) {
        if (auth.isAuthed) {
            $scope.userProfile = {};
            $scope.loading = true;

            $scope.validateRetypePassword = function (pwd) {
                if($scope.userPwd.password) {
                    if ($scope.userPwd.password != pwd) {
                        $scope.notMatch = true;
                    } else {
                        $scope.notMatch = false;
                    }
                }
            };
            var refresh = function(){
                $http.get($rootScope.apiUrl + ':81/students/4/?format=json')
                    .success(function (response) {
                        $scope.userProfile = response;
                        if($scope.userProfile.type){
                                $scope.userProfile.type = "Hoc Sinh Tin Chi";
                        }
                        else{
                             $scope.userProfile.type = "Hoc Sinh Thuong";
                        }
                    });
            };
            refresh();

            $scope.editProfileModal = function () {
                if(auth.isAuthed()) {
                    console.log($scope.userProfile)
                    $mdDialog.show({
                        locals: {userProfile : $scope.userProfile},
                        controller: DialogEditController,
                        templateUrl: 'components/profile/editProfileTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogEditController($scope, userProfile) {
                $scope.userProfile = userProfile;
                var toastSuccess = $mdToast.simple()
                    .textContent('Chỉnh sửa Thông tin cá nhân thành công.')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Chỉnh sửa Thông tin cá nhân thất bại!')
                    .position('right bottom');

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.edit = function () {
                    if (auth.isAuthed) {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl + '/update_user_info',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                name: $scope.userProfile.name,
                                email: $scope.userProfile.email
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

            var toastSuccess = $mdToast.simple()
                .textContent('Thay đổi Mật khẩu thành công')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Thay đổi Mật khẩu thất bại')
                .position('right bottom');

            $scope.userPwd = {
                passwordOld : "",
                password: "",
                password2:""
            };

            $scope.$watch('userPwd.password2',function (newValue) {
                if($scope.userPasswordForm.password.$valid && $scope.userPwd.password != newValue) {
                    console.log($scope.userPasswordForm);
                    $scope.userPasswordForm.password2.$error = {'notMatch': true};
                    $scope.userPasswordForm.password2.$invalid = true;
                    $scope.userPasswordForm.password2.$valid = false;
                } else {
                    $scope.userPasswordForm.password2.$error = {};
                    $scope.userPasswordForm.password2.$invalid = false;
                    $scope.userPasswordForm.password2.$valid = true;
                }
            });

            $scope.saveChangePwd = function () {
                if (auth.isAuthed) {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/update_user_pwd',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            username: $rootScope.profileName,
                            password: $scope.userPwd.passwordOld,
                            passwordNew: $scope.userPwd.password
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if(response['result']) {
                            $mdToast.show(toastSuccess);
                            $state.reload();
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

            //Web Hook

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }

    });
