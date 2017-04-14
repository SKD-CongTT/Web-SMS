angular.module('webix')
    .controller('generalController', function($scope,$http,$interval,auth,$rootScope,$timeout,$state,webNotification,searchQuery) {
        if(auth.isAuthed()){

            searchQuery.setQuery("");
            $scope.chartData = [];
            $scope.events = [];
            $scope.agents = [];
            $scope.loadingChart = true;
            $scope.loadingTableAlert = true;
            $scope.loadingTableAgent = true;

            $scope.isNumber = angular.isNumber;
            $scope.panelResult = [{
                name : "Member",
                info : 0,
                href : "dashboard.logs"
            },{
                name : "Course Available",
                info : 0,
                href : "dashboard.alerts"
            },{
                name : "Time",
                info : 0,
                href : "dashboard.websites"
            },{
                name : "Unknow",
                info : 0,
                href : "dashboard.logs"
            }];

            /*Agent chart*/

            Highcharts.setOptions({
                global: {
                    timezoneOffset: 0
                }
            });

            var createCountChart = function () {
                $http.get($rootScope.apiUrl +'/log_perform/id/undefined/virtual_host/undefined/from/1/size/20/range/1')
                    .success(function (response) {
                        $scope.loadingChart = false;
                        $scope.chartData = [];
                        $scope.panelResult[0].info = response['count'];
                        if(response['chart']){
                            $scope.chartData[0] = response['chart'][0];
                            for (var i = 1; i < response['chart'].length; i++) {
                                $scope.chartData.push(response['chart'][i]);
                            }
                            $scope.chartConfig = {
                                options: {
                                    chart: {
                                        type: 'areaspline',
                                        zoomType: 'x',
                                        borderColor: "#e5e6e9",
                                        borderWidth: 0,
                                        marginTop: 100
                                    },
                                    credits: false,
                                    plotOptions: {
                                        "series": {
                                            "stacking": "normal",
                                            animation: false,
                                            turboThreshold : 0,
                                            lineWidth : 1,
                                            lineColor: '#303F9F',
                                            shadow: false,
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    },
                                    tooltip:{
                                        formatter: function () {
                                            return Highcharts.dateFormat('%d/%m/%Y %H:%M:%S', this.x) + "<br/>" +"<b>" +this.y + " sự kiện" + "</b>";
                                        }
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                },
                                xAxis: {
                                    type: 'datetime',
                                    minTickInterval : 1000*60
                                },
                                yAxis: {
                                    minTickInterval:1,
                                    title: {
                                        style:{
                                            fontSize: "14px"
                                        },
                                        text: 'Số lượng sự kiện'
                                    }
                                },
                                title: {
                                    text: '',
                                    style: {
                                        'fontSize': '14px'
                                    }
                                },
                                series: [{
                                    data: $scope.chartData,
                                    showInLegend: false,
                                    color: '#536DFE'
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
                            var chart = $('#chartLine').highcharts();
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
                    })
                    .error(function (respones) {
                        $scope.chartData = [];
                    });
            };

            var stopChart = $interval(function () {
                createCountChart();
            },1000*30);

            createCountChart();
            webNotification.allowRequest = true;
            var getData = function () {

                $http.get($rootScope.apiUrl+'/get_number_alerts')
                    .success(function (response) {
                        if($scope.panelResult[1].info != 0 && ($scope.totalAlerts < response)) {
                            var audio = new Audio($rootScope.downloadUrl+'/alert_sound.mp3');
                            audio.play();
                            webNotification.showNotification('THÔNG BÁO', {
                                body: 'Hệ thống có CẢNH BÁO mới.',
                                autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                            });
                        }
                        $scope.panelResult[1].info = response;
                    });

                $http.get($rootScope.apiUrl + '/get_number_agents')
                    .success(function (response) {
                        $scope.panelResult[3].info = response;
                    });

                $http.get($rootScope.apiUrl+'/get_agents_logs_from_user')
                    .success(function (response) {
                        if(response['result'] !== false) {
                            $scope.agents = response;
                        }
                        $scope.loadingTableAgent = false;
                    });

            };

            setTimeout(function () {
                $scope.$apply(getData);
            },3000);

            $scope.getLoadResultsCallback = getLoadResultsCallback;
            var loadPageCallbackWithDebounce;
            function getLoadResultsCallback(loadPageCallback){
                loadPageCallbackWithDebounce = _.debounce(loadPageCallback, 2000);
            }

            $scope.getWebsites = getWebsites;
            function getWebsites(page, pageSize) {
                if(!page) page = 1;
                page =(page-1)*pageSize;
                return $http.get($rootScope.apiUrl+'/get_status_websites/from/' + page + '/size/' + pageSize )
                    .then(function (response) {
                        if(response.data.result){
                            $scope.panelResult[2].info = response.data.count;
                        }
                        return {
                            results: response.data.result,
                            totalResultCount: response.data.count
                        }
                    })
            }


            $scope.getLoadResultsAlertCallback = getLoadResultsAlertCallback;
            var loadPageAlertCallbackWithDebounce;
            function getLoadResultsAlertCallback(loadPageCallback){
                loadPageAlertCallbackWithDebounce = _.debounce(loadPageCallback, 1000);
            }
            $scope.refresh_alert = refresh_alert;
            function refresh_alert(page, pageSize) {
                if (auth.isAuthed()) {
                    page = typeof page !== 'undefined' ? page : 1;
                    $scope.page = page;
                    $scope.pageSize = pageSize;
                    page =(page-1)*pageSize;
                    return $http.get($rootScope.apiUrl + '/get_alerts/from/' + page + '/size/' + pageSize)
                        .then(function (response) {
                            $scope.count = response.data.count;
                            return {
                                results: response.data.result,
                                totalResultCount: response.data.count
                            }
                        });
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            }

            var stopGetData = $interval(function () {
                getData();
                if(loadPageCallbackWithDebounce){
                    loadPageCallbackWithDebounce();
                }
            },1000*60);

            var changeRoute = $rootScope.$on('$locationChangeSuccess', function() {
                $interval.cancel(stopChart);
                $interval.cancel(stopGetData);
                $state.reload();
                changeRoute();
            });

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });