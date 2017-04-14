angular.module('webix')

    .controller('forgotController',function ($scope, $http, $location, $timeout, $rootScope, Notification) {

        $scope.doForgot = function () {
            $http({
                method: 'POST',
                url: $rootScope.apiUrl+"/request_resets_password",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    email: $scope.email
                }
            }).success(function (response) {
                if (response['result'] == true) {
                    Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Gửi yêu cầu khôi phục mật khẩu thành công', positionX: 'center', delay: 3000});
                    $timeout(function () {
                        $location.path('/login');
                    }, 2000);
                } else if (response['result'] == 'exist') {
                    Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Người dùng đã gửi yêu cầu khôi phục mật khẩu', positionX: 'center', delay: 3000});
                } else {
                        Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Không tồn tại email', positionX: 'center', delay: 3000});
                    }
            }).error(function () {
                Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Gửi yêu cầu khôi phục mật khẩu thất bại', positionX: 'center', delay: 3000});
            })
        };

    });
