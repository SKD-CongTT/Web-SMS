
angular.module('webix')
    .controller('securityController', function($scope,$http,$interval,auth,$rootScope,$timeout,$state,webNotification, searchQueryAlert, searchQuery) {
        if(auth.isAuthed()){
            $scope.chartData = [];
            $scope.events = [];
            $scope.top_ips = [];
            $scope.top_att_website = [];
            $scope.top_alert = [];
            $scope.loadingChart = true;
            $scope.loadingTableWebsite = true;
            $scope.loadingTableIp = true;
            $scope.loadingTableAlert = true;
            $scope.chartPieData = [];

            $scope.panelResult = [{
                name : "Sự cố",
                info : 0,
                href : "dashboard.alerts"
            },{
                name : "Tấn công",
                info : 0,
                click: "attack"
            },{
                name : "Sự cố trong ngày",
                info : 0,
                href : "dashboard.alerts.positive"
            },{
                name : "Website Down",
                info : 0,
                href : "dashboard.websites"
            }];
            
            $scope.clickDetail = function (string) {
                searchQueryAlert.setQueryAlert(string);
                $state.go('dashboard.alerts');
            };

            webNotification.allowRequest = true;
            var getData = function () {
                $http.get($rootScope.apiUrl + '/get_number_alerts')
                    .success(function (response) {
                        $scope.panelResult[0].info = response;
                    });

                $http.get($rootScope.apiUrl+'/get_number_attacks')
                    .success(function (response) {
                        $scope.panelResult[1].info = response;
                    });

                $http.get($rootScope.apiUrl+'/getNumberAlertInDay')
                    .success(function (response) {
                        $scope.panelResult[2].info = response;
                    });

                $http.get($rootScope.apiUrl+'/get_top_alert')
                    .success(function (response) {
                        if (response.length) {
                            $scope.top_alert = response;
                        }
                        else {
                            $scope.top_alert = [];
                        }
                        $scope.loadingTableAlert = false;
                    });

                $http.get($rootScope.apiUrl+'/getTopAttack')
                    .success(function (response) {
                        if (response.length) {
                            $scope.top_attack = response;
                            $scope.chartPieConfig = {
                                options: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie',
                                        marginTop: 50
                                    },
                                    credits: false,
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false
                                            },
                                            showInLegend: true,
                                            animation: true
                                        }
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    legend: {
                                        align: 'right',
                                        layout: 'vertical',
                                        verticalAlign: 'middle'
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                },
                                size: {
                                    height: 350
                                },
                                series: [{
                                    name: 'Tỷ lệ',
                                    colorByPoint: true,
                                    data: $scope.top_attack,
                                    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
                                }],
                                func: function (chart) {
                                    if(chart){
                                        $timeout(function() {
                                            chart.reflow();
                                        }, 0);
                                    }
                                }
                            };
                        }
                        else {
                            var chart = $('#chartPie').highcharts();
                            chart.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu thống kê</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                        }
                        $scope.loadingTableAttack = false;
                        $scope.loadingChart = false;
                    });


                $http.get($rootScope.apiUrl+'/get_top_ip_attack')
                    .success(function (response) {
                        if (response.length) {
                            $scope.top_ips = response;
                        }
                        $scope.loadingTableIp = false;
                    });
            };
            $scope.getLoadResultsCallback = getLoadResultsCallback;
            var loadPageCallbackWithDebounce;
            function getLoadResultsCallback(loadPageCallback){
                loadPageCallbackWithDebounce = _.debounce(loadPageCallback, 2000);
            }

            $scope.getWebsites = getWebsites;
            function getWebsites(page, pageSize) {
                if(!page) page = 1;
                page =(page-1)*pageSize;
                return $http.get($rootScope.apiUrl+'/getTopIncidentWeb/from/' + page + '/size/' + pageSize )
                    .then(function (response) {
                        $scope.panelResult[3].info = response.data.count;
                        return {
                            results: response.data.result,
                            totalResultCount: response.data.count
                        }
                    })
            }


            var stopGetData = $interval(function () {
                getData();
                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            },1000*60);

            setTimeout(function () {
                $scope.$apply(getData);
            }, 2000);


            var changeRoute = $rootScope.$on('$locationChangeSuccess', function() {
                $interval.cancel(stopGetData);
                $state.reload();
                changeRoute();
            });

            $scope.clickFilter = function (key, query) {
                searchQuery.setSearchQuery(key, query);
                $state.go("dashboard.logs");
            };
            $scope.clickAlert = function (query) {
                searchQueryAlert.setQueryAlert('"'+query+'"');
                $state.go("dashboard.alerts");
            }
        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });