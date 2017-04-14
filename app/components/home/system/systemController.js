angular.module('webix')
    .controller('systemController', function($scope,$http,$interval,auth,$rootScope,$timeout,$state,webNotification,searchQuery) {
        if(auth.isAuthed()){
            $scope.gotoAnchor = function() {
                $state.go('dashboard.home.system',{'#':'status'});
            };
            searchQuery.setQuery("");
            $scope.chartData = [];
            $scope.events = [];
            $scope.agents = [];
            $scope.loadingChart = true;
            $scope.loadingTableWebsite = true;
            $scope.loadingTableAgent = true;
            $scope.loadingTableChart = true;
            $scope.chartPieData = [];
            $scope.processDetail = [];
            $scope.chartCpuData = [];
            $scope.chartRamData = [];
            $scope.chartStorageData = [];

            $scope.selected = [];
            $scope.isNumber = angular.isNumber;
            $scope.panelResult = [{
                name : "Trạng thái",
                info : "BÌNH THƯỜNG"
            },{
                name : "Sự kiện",
                info : 0,
                href : "dashboard.logs"
            },{
                name : "Cảm biến",
                info : 0,
                href : "dashboard.sensors"
            },{
                name : "Sự cố",
                info : 0,
                href : "dashboard.alerts"
            }];

            $scope.$watch('processDetail',function (newValue) {
                if(newValue.length != 0) {
                    for (var i = 0; i< newValue.length;i++) {
                        if (newValue[i].status === false) {
                            $scope.panelResult[0] = {
                                name : "Trạng thái",
                                info : "BẤT THƯỜNG"
                            };
                        }
                    }
                }
            });

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
                        $scope.panelResult[1].info = response['count'];
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
                                        borderWidth: 0
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

                $http.get($rootScope.apiUrl + '/get_number_agents')
                    .success(function (response) {
                        $scope.panelResult[2].info = response;
                    });

                $http.get($rootScope.apiUrl+'/get_number_alerts')
                    .success(function (response) {
                        if($scope.panelResult[3].info != 0 && ($scope.totalAlerts < response)) {
                            var audio = new Audio($rootScope.downloadUrl+'/alert_sound.mp3');
                            audio.play();
                            webNotification.showNotification('THÔNG BÁO', {
                                body: 'Hệ thống có CẢNH BÁO mới.',
                                autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                            });
                        }
                        $scope.panelResult[3].info = response;
                    });

                $http.get($rootScope.apiUrl+'/get_agents_logs_from_user')
                    .success(function (response) {
                        if(response['result'] !== false) {
                            $scope.agents = response;
                        }
                        $scope.loadingTableAgent = false;
                    });

                $http.get($rootScope.apiUrl+'/get_server_performances')
                    .success(function (response) {
                        $scope.loadingTableChart = false;
                        $scope.processDetail = response['detail'];

                        if(response['ram']) {
                            $scope.chartCpuData = response['ram'];
                            $scope.chartRamConfig = {
                                options: {
                                    chart: {
                                        type: 'pie'
                                    },
                                    credits: false,
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    },
                                    tooltip: {
                                        headerFormat: '<span style="font-size: 15px"><b>{point.key}: </b></span>',
                                        pointFormat: '<b>{point.percentage:.1f}%</b>'
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                },
                                title:{
                                    style:{
                                        fontSize: "14px"
                                    },
                                    text: "RAM"
                                },
                                size: {
                                  height: 200
                                },
                                series: [{
                                    data: $scope.chartCpuData,
                                    colors: ['#536DFE','#BDBDBD']
                                }],
                                func: function(chart) {
                                    if(chart){
                                        $timeout(function() {
                                            chart.reflow();
                                        }, 0);
                                    }
                                }
                            };
                        } else {
                            $scope.chartCpuData = [];
                            var chart = $('#chartRamPie').highcharts();
                            chart.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Ram</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                        }
                        if(response['cpu']) {
                            $scope.chartCpuData = response['cpu'];
                            $scope.chartCpuConfig = {
                                options: {
                                    chart: {
                                        type: 'pie'
                                    },
                                    credits: false,
                                    plotOptions: {
                                        "pie": {
                                            animation: true,
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    },
                                    tooltip: {
                                        headerFormat: '<span style="font-size: 15px"><b>{point.key}: </b></span>',
                                        pointFormat: '<b>{point.percentage:.1f}%</b>'
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                },
                                title:{
                                    style:{
                                        fontSize: "14px"
                                    },
                                    text: "CPU"
                                },
                                size: {
                                    height: 200
                                },
                                series: [{
                                    data: $scope.chartCpuData,
                                    colors: ['#536DFE','#BDBDBD']
                                }],
                                func: function (chart) {
                                    if(chart){
                                        $timeout(function() {
                                            chart.reflow();
                                        }, 0);
                                    }
                                }
                            };
                        } else {
                            $scope.chartCpuData = [];
                            var chart = $('#chartCpuPie').highcharts();
                            chart.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Cpu</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                        }
                        if(response['storage']) {
                            $scope.chartStorageData = response['storage'];
                            $scope.chartStorageConfig = {
                                options: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    credits: false,
                                    plotOptions: {
                                        "pie": {
                                            animation: true,
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    },
                                    tooltip: {
                                        headerFormat: '<span style="font-size: 15px"><b>{point.key}: </b></span>',
                                        pointFormat: '<b>{point.percentage:.1f}%</b>'
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                },
                                title:{
                                    style:{
                                        fontSize: "14px"
                                    },
                                    text: "Storage"
                                },
                                size: {
                                    height: 200
                                },
                                series: [{
                                    data: $scope.chartStorageData,
                                    colors: ['#536DFE','#BDBDBD']
                                }],
                                func: function (chart) {
                                    if(chart){
                                        $timeout(function() {
                                            chart.reflow();
                                        }, 0);
                                    }
                                }
                            };
                        } else {
                            $scope.chartStorageData = [];
                            var chart = $('#chartCpuPie').highcharts();
                            chart.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Storage</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                        }
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