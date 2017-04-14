/**
 * Created by sonsi_000 on 6/27/2016.
 */

angular.module('webix')

    .controller('agentsController',function ($scope,$rootScope,$http,auth,$window, $mdDialog, $mdToast, $state) {
        if(auth.isAuthed()) {
            $scope.isExistIP = false;
            $scope.agents =[];
            $scope.agentmodal = {};
            $scope.agent = {};

            $scope.loading = true;


            $scope.copySuccess = function () {
                $mdToast.show(toastCopy);
            };

            var refresh = function () {
                if (auth.isAuthed()) {
                    $scope.loading = true;
                    $http.get($rootScope.apiUrl + '/get_agent_information')
                        .success(function (response) {
                            $scope.agents = response;
                            $scope.loading = false;
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            refresh();

            $scope.checkExistIP = function (ip) {
                if (ip){
                    var keepGoing = true;
                    angular.forEach($scope.agents, function(each){
                        if(keepGoing) {
                            if (ip == each.ipAddress){
                                $scope.isExistIP = true;
                                keepGoing = false;
                            } else {
                                $scope.isExistIP = false;
                            }
                        }
                    })
                } else $scope.isExistIP = false;
            };


            var toastCopy = $mdToast.simple()
                .textContent('Key đã được sao chép vào Clipboard')
                .position('right bottom');

            var toastSuccess = $mdToast.simple()
                .textContent('Xóa Sensor thành công')
                .position('right bottom');

            var toastFail = $mdToast.simple()
                .textContent('Xóa Sensor thất bại')
                .position('right bottom');

            $scope.deleteAgentModal = function (value) {
                if(auth.isAuthed()) {
                    var confirm = $mdDialog.confirm()
                        .title('Bạn có chắc chắn muốn xóa Sensor này ?')
                        .textContent('Toàn bộ dữ liệu liên quan tới Sensor sẽ bị xóa.')
                        .ariaLabel('Delete Sensor')
                        .ok('Xác nhận')
                        .cancel('Hủy bỏ');

                    $mdDialog.show(confirm).then(function() {
                        $http.delete($rootScope.apiUrl + '/delete_agent/'+ value )
                            .success(function(response){
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

            $scope.addAgentModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        controller: DialogAddController,
                        templateUrl: 'components/agents/addAgentTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.editAgentModal = function (value) {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {value : value},
                        controller: DialogEditController,
                        templateUrl: 'components/agents/editAgentTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.downloadAgentModal = function () {
                if(auth.isAuthed()) {
                    $scope.formDownload = {};
                    $mdDialog.show({
                        controller: DialogDownloadController,
                        templateUrl: 'components/agents/downloadTemplate.html',
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
                    .textContent('Thêm Sensor thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Thêm Sensor thất bại')
                    .position('right bottom');

                $scope.userList = [];
                $http.get($rootScope.apiUrl + '/get_users_with_agent_permissions').success(function (response) {
                    $scope.userList = response;
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = false;

                $scope.add = function () {
                    $scope.formDownload = {};
                    $scope.onRequest = true;
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/add_agent',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            agent_name: $scope.agent.agent_name,
                            ipAddress: $scope.agent.ipAddress,
                            description: $scope.agent.description,
                            userid_arr: $scope.agent.userControl
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        $scope.onRequest = false;
                        if(response['result']) {
                            $scope.agent.key = response['key'];
                            $mdToast.show(toastSuccess);

                            $mdDialog.show({
                                contentElement: '#myStaticDialog',
                                parent: angular.element(document.body),
                                clickOutsideToClose: false
                            });
                            refresh();
                        } else {
                            $mdToast.show(toastFail);
                        }
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                        $scope.onRequest = false;
                    })
                };
            }

            function DialogEditController($scope, $mdDialog, value) {

                var toastSuccess = $mdToast.simple()
                    .textContent('Chỉnh sửa Sensor thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Chỉnh sửa Sensor thất bại')
                    .position('right bottom');

                $scope.userList = [];

                $http.get($rootScope.apiUrl + '/get_agent_information/' + value).success(function (response) {
                    $scope.agentModal = response[0];
                });

                $http.get($rootScope.apiUrl + '/get_users_with_agent_permissions').success(function (response) {
                    $scope.userList = response;
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                $scope.changeUserPermisson = function () {
                    angular.forEach($scope.agentModal.users, function(u){
                        $http.get($rootScope.apiUrl + '/change_agent_permission/'+ u.id +'/'+agentModal.id)
                    });
                    refresh();
                };

                $scope.edit = function () {
                    var user_arr = [];
                    angular.forEach($scope.agentModal.users, function(user){
                        user_arr.push(user.id)
                    });
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/modify_agent/' + $scope.agentModal.id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            unconstant_name: $scope.agentModal.unconstant_name,
                            ipAddress: $scope.agentModal.ipAddress,
                            description: $scope.agentModal.description,
                            userid_arr: user_arr
                        }
                    }).success(function (response) {
                        $mdDialog.hide();
                        if (response['result']) {
                            $mdToast.show(toastSuccess);
                        } else {
                            $mdToast.show(toastFail);
                        }
                        //refresh();
                        $state.reload();
                    }).error(function () {
                        $mdDialog.hide();
                        $mdToast.show(toastFail);
                        refresh();
                    })
                };
            }

            function DialogDownloadController($scope, $mdDialog) {

                $scope.userList = [];
                $http.get($rootScope.apiUrl + '/get_users_with_agent_permissions').success(function (response) {
                    $scope.userList = response;
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                /*Download Agent*/
                $scope.formDownload = {};

                $scope.$watch('formDownload.os', function(os){
                    delete $scope.formDownload.server;
                    angular.forEach($scope.downloadOptions, function(option){
                        if(option.os === os) {
                            $scope.selectedOs = option;
                        }
                    });
                });

                $scope.downloadAgent = function () {
                    if ($scope.formDownload.os == 'Windows' && $scope.formDownload.server == 'Apache') {
                        //$window.location = $rootScope.downloadUrl +'/windows_apache.exe';
                        $window.open($rootScope.downloadUrl +'/windows_apache.exe','_blank')
                    }
                    if ($scope.formDownload.os == 'Windows' && $scope.formDownload.server == 'Microsoft IIS') {
                        //$window.location = $rootScope.downloadUrl +'/windows_iis.exe';
                        $window.open($rootScope.downloadUrl +'/windows_iis.exe','_blank');
                    }
                    if ($scope.formDownload.os == 'Windows' && $scope.formDownload.server == 'Nginx') {
                        //$window.location = $rootScope.downloadUrl + '/windows_nginx.exe';
                        $window.open($rootScope.downloadUrl + '/windows_nginx.exe','_blank');
                    }
                    if ($scope.formDownload.os == 'Linux' && $scope.formDownload.server == 'Apache') {
                        //$window.location = $rootScope.downloadUrl + '/linux_apache.tar';
                        $window.open($rootScope.downloadUrl + '/linux_apache.tar','_blank');
                    }
                    if ($scope.formDownload.os == 'Linux' && $scope.formDownload.server == 'Nginx') {
                        //$window.location = $rootScope.downloadUrl + '/linux_nginx.tar';
                        $window.open($rootScope.downloadUrl + '/linux_nginx.tar');
                    }
                    $('#downloadModal').modal('hide');
                };

                $scope.downloadGuide = function () {
                    // $window.location = $rootScope.downloadUrl + '/VNIST_agent_installation_guide_windows.htm';
                    $window.open($rootScope.downloadUrl + '/VNIST_agent_installation_guide_windows.htm','_blank');
                };

                $scope.downloadOptions = [{
                    'os' : 'Windows',
                    'server' : ['Apache', 'Microsoft IIS', 'Nginx']
                },{
                    'os' : 'Linux',
                    'server' : ['Apache','Nginx']
                }];


            }
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    });

