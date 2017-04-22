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
                    .textContent('Successfully edit personal infomation')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Failed to edit personal infomation')
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
                            method: 'PATCH',
                            url: $rootScope.apiUrl + ':81/students/' + $scope.userProfile.id + "/",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                first_name: $scope.userProfile.first_name,
                                last_name: $scope.userProfile.last_name,
                                email: $scope.userProfile.email,
                                bio: $scope.userProfile.bio,
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            console.log(response)
                            if(response['id'] == $scope.userProfile.id) {
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
                .textContent('Successfully change password')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Failed to change password')
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
