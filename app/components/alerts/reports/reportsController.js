/**
 * Created by sonsi_000 on 12/16/2016.
 */


angular.module('webix')
    .controller('reportsController',function ($scope,$rootScope,$http,auth,$mdToast,$mdDialog) {
        if(auth.isAuthed()){

            /*Report*/
            $scope.selectRange = function (range) {
                console.log(range);
                $scope.startDate = range.startDate;
                $scope.endDate = range.endDate;
            };
            $scope.time = "";

            $scope.reportTypeLists = [
                {id:1, name: 'Tổng hợp'},
                {id:2, name: 'Tình trạng các cuộc tấn công mạng theo thời gian'},
                {id:3, name: 'Danh sách (TOP 100) địa chỉ IP tấn công nhiều nhất vào hệ thống'}
            ];
            $scope.reportType = [];

            $scope.isGeneral = false;
            $scope.isAttackActivities = false;
            $scope.isAttackedIp = false;

            $scope.$watch('reportType',function (newValue) {
                $scope.isGeneral = _.includes(newValue, '1');
                $scope.isAttackActivities = _.includes(newValue, '2');
                $scope.isAttackedIp = _.includes(newValue, '3');
            });

            $scope.downloadReport = function() {
                if(auth.isAuthed()) {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + '/export',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            from: $scope.startDate,
                            to: $scope.endDate,
                            isGeneral: $scope.isGeneral,
                            isAttackActivities: $scope.isAttackActivities,
                            isAttackedIp: $scope.isAttackedIp
                        },
                        responseType : 'arraybuffer'
                    }).success(function(data) {
                        // TODO when WS success
                        var file = new Blob([ data ], {
                            type : 'application/pdf'
                        });
                        saveAs(file, '[WebInspector]Bao-cao-tong-hop.pdf')

                    }).error(function(data, status, headers, config) {
                        //TODO when WS error
                    });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.downloadQuickReport = function(type) {
                if(auth.isAuthed()) {
                    $http({
                        url : $rootScope.apiUrl + '/'+ type,
                        method : 'GET',
                        // params : {},
                        // headers : {
                        //     'Content-type' : 'application/pdf',
                        // },
                        responseType : 'arraybuffer'
                    }).success(function(data) {
                        if(data['result'] != false) {
                            // TODO when WS success
                            var file = new Blob([ data ], {
                                type : 'application/pdf'
                            });

                            var name ="";

                            if (type == 'daily_export') {
                                name = "[WebInspector]Bao-cao-nhanh-trong-ngay";
                            }

                            if (type == 'weekly_export') {
                                name = "[WebInspector]Bao-cao-nhanh-trong-tuan";
                            }

                            if (type == 'monthly_export') {
                                name = "[WebInspector]Bao-cao-nhanh-trong-thang";
                            }

                            //trick to download store a file having its URL
                            // var fileURL = URL.createObjectURL(file);
                            // var a         = document.createElement('a');
                            // a.href        = fileURL;
                            // a.target      = '_blank';
                            // a.download    = 'yourfilename.pdf';
                            // document.body.appendChild(a);
                            // a.click();
                            saveAs(file, name + '.pdf');
                        }
                    }).error(function(data, status, headers, config) {
                        //TODO when WS error
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
