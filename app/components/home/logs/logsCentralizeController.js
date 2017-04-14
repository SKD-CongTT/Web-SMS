'use strict';

angular.module('webix')
    .controller('logsCentralizeController', function($scope,$http,$interval,auth,$rootScope,$timeout,$state,searchQuery ) {
        if (!auth.isAuthed()) {
            alert('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        } else {
            searchQuery.setQuery("");
            $scope.loadingChart = true;
            $scope.loading = true;

            $scope.mapData = [];
            $scope.mapConfig = {};

            $scope.chartStatusData = [];
            $scope.chartBrowserData = [];
            $scope.chartMethodData = [];
            $scope.chartStatusConfig = {};
            $scope.chartBrowserConfig = {};
            $scope.chartMethodConfig = {};

            $scope.topUrl = [];
            $scope.topIp = [];
            $scope.topReferer = [];

            $scope.panelResult = [
                {
                    name : "Tổng sự kiện",
                    info : 0,
                    href: "dashboard.logs"
                },{
                    name : "Realtime",
                    info : 0,
                    range: "realtime"
                },{
                    name : "Sự kiện trong ngày",
                    info : 0,
                    range: "day"
                },{
                    name : "Sự kiện trong tháng",
                    info : 0,
                    range: "month"
                }];

            $scope.detailLogs = function (range) {
                if (range == 'realtime') {
                    searchQuery.setQuery("time>="+ moment().subtract(10, 'minutes').format("YYYY-MM-DDTHH:mm:ss"));
                } else if (range == 'day') {
                    searchQuery.setQuery("time>="+moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss"));
                } else if (range == 'month') {
                    searchQuery.setQuery("time>="+moment().startOf('month').format("YYYY-MM-DDTHH:mm:ss"));
                }
                $state.go("dashboard.logs");
            };

            /*Agent chart*/
            var clickChart = function (key, query) {
                searchQuery.setSearchQuery(key, query);
                $state.go("dashboard.logs");
            };

            var getData = function () {
                $http.get($rootScope.apiUrl + '/get_top_fields_logs')
                    .success(function (response) {
                        if (response['result']) {
                            $scope.panelResult[0].info = response['count'];
                            if (response['aggregations']) {
                                $scope.topUrl = response['aggregations']['url'];
                                $scope.topIp = response['aggregations']['remote_host'];
                                $scope.topReferer = response['aggregations']['referer'];
                            }

                            if (response['aggregations']['country']) {
                                $scope.mapData = response['aggregations']['country'];
                                $scope.mapConfig = {
                                    options: {
                                        chart: {
                                            backgroundColor: '#B2EBF2'
                                        },
                                        legend: {
                                            title: {
                                                text: 'Số lượng<br>IP truy cập',
                                                style: {
                                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                                                }
                                            },
                                            align: 'left',
                                            borderWidth: 1,
                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                            floating: true,
                                            layout: 'vertical',
                                            verticalAlign: 'bottom',
                                            x:50,
                                            y:-10,
                                            // symbolWidth: 300
                                        },
                                        credits: false,
                                        mapNavigation: {
                                            enabled: true,
                                            buttonOptions: {
                                                verticalAlign: 'top',
                                                align: 'right'
                                            }
                                        },
                                        colorAxis: {
                                            min: 1,
                                            minColor: '#808080',
                                            maxColor: '#ff0000',
                                            stops: [
                                                [0, '#808080'],
                                                [0.67, '#d22d2d'],
                                                [1, '#ff0000']
                                            ]
                                        },
                                        exporting: {
                                            enabled: false
                                        }
                                    },
                                    chartType: 'map',
                                    title: {
                                        text: ''
                                    },

                                    size: {
                                        height: 400
                                    },
                                    series: [{
                                        data: $scope.mapData,
                                        mapData: Highcharts.maps['custom/world'],
                                        joinBy: ['iso-a2', 'code'],
                                        animation: true,
                                        name: 'Số lượng IP truy cập từ'
                                    }]
                                }
                            }

                            if (response['aggregations']['status']) {
                                $scope.chartStatusData = response['aggregations']['status'];
                                $scope.chartStatusConfig = {
                                    options: {
                                        chart: {
                                            plotBackgroundColor: null,
                                            plotBorderWidth: null,
                                            plotShadow: false,
                                            type: 'pie',
                                            marginTop: 100,
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
                                                },
                                                point: {
                                                    events: {
                                                        dblclick: function () {
                                                            clickChart("status",this.name);
                                                        }
                                                    }
                                                }
                                            },
                                        tooltip: {
                                            headerFormat: 'Mã <span style="font-weight: bold;">{point.key}: </span>',
                                            pointFormat: '<b>{point.percentage:.3f}%</b>' + '<br>(Nháy đúp để xem chi tiết)'
                                        },
                                        legend: {
                                            align: 'center',
                                            layout: 'horizontal',
                                            verticalAlign: 'bottom'
                                        },
                                        exporting: {
                                            enabled: false
                                        }
                                    },
                                    title: {
                                        text: ""
                                    },
                                    size: {
                                        height: 400
                                    },
                                    series: [{
                                        data: $scope.chartStatusData,
                                        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
                                    }],
                                    func: function (chart) {
                                        if (chart) {
                                            $timeout(function () {
                                                chart.reflow();
                                            }, 0);
                                        }
                                    }
                                };
                            }

                            if (response['aggregations']['browser']) {
                                $scope.chartBrowserData = response['aggregations']['browser'];
                                $scope.chartBrowserConfig = {
                                    options: {
                                        chart: {
                                            plotBackgroundColor: null,
                                            plotBorderWidth: null,
                                            plotShadow: false,
                                            type: 'pie',
                                            marginTop: 100,
                                        },
                                        credits: false,
                                        plotOptions: {
                                            pie: {
                                                allowPointSelect: true,
                                                cursor: 'pointer',
                                                showInLegend: true,
                                                dataLabels: {
                                                    enabled: false,
                                                    format: '<b>{point.name}</b>: {point.percentage:.3f} %',
                                                    style: {
                                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                                    }
                                                },
                                                point: {
                                                    events: {
                                                        dblclick: function () {
                                                            clickChart("browser",this.name);
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        tooltip: {
                                            headerFormat: '<span style="font-weight: bold;">{point.key}: </span>',
                                            pointFormat: '<b>{point.percentage:.3f}%</b>' + '<br>(Nháy đúp để xem chi tiết)'
                                        },
                                        legend: {
                                            align: 'center',
                                            layout: 'horizontal',
                                            verticalAlign: 'bottom'
                                        },
                                        exporting: {
                                            enabled: false
                                        }
                                    },
                                    title: {
                                        text: ""
                                    },
                                    size: {
                                        height: 400
                                    },
                                    series: [{
                                        data: $scope.chartBrowserData,
                                        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
                                    }],
                                    func: function (chart) {
                                        if (chart) {
                                            $timeout(function () {
                                                chart.reflow();
                                            }, 0);
                                        }
                                    }
                                };
                            }

                            if (response['aggregations']['method']) {
                                $scope.chartMethodData = response['aggregations']['method'];
                                $scope.chartMethodConfig = {
                                    options: {
                                        chart: {
                                            plotBackgroundColor: null,
                                            plotBorderWidth: null,
                                            plotShadow: false,
                                            type: 'pie',
                                            marginTop: 100,
                                        },
                                        credits: false,
                                        plotOptions: {
                                            pie: {
                                                allowPointSelect: true,
                                                cursor: 'pointer',
                                                dataLabels: {
                                                    enabled: false,
                                                    format: '<b>{point.name}</b>: {point.percentage:.3f} %',
                                                    style: {
                                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                                    }
                                                },
                                                showInLegend: true,
                                                point: {
                                                    events: {
                                                        dblclick: function () {
                                                            clickChart("method",this.name);
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        tooltip: {
                                            headerFormat: '<span style="font-weight: bold;">{point.key}: </span>',
                                            pointFormat: '<b>{point.percentage:.3f}%</b>' + '<br>(Nháy đúp để xem chi tiết)'
                                        },
                                        exporting: {
                                            enabled: false
                                        },
                                        legend: {
                                            align: 'center',
                                            layout: 'horizontal',
                                            verticalAlign: 'bottom'
                                        },
                                    },
                                    title: {
                                        text: ""
                                    },
                                    size: {
                                        height: 400
                                    },
                                    series: [{
                                        data: $scope.chartMethodData,
                                        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
                                    }],
                                    func: function (chart) {
                                        if (chart) {
                                            $timeout(function () {
                                                chart.reflow();
                                            }, 0);
                                        }
                                    }
                                };
                            }
                        }
                        else {
                            var chart1 = $('#chartStatusPie').highcharts();
                            chart1.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Mã phả hồi</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                            var chart2 = $('#chartBrowserPie').highcharts();
                            chart2.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Trình duyệt Web</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                            var chart3 = $('#chartMethodPie').highcharts();
                            chart3.setTitle({
                                useHTML: true,
                                text: '<em>Không có dữ liệu Phương thức HTTP</em>',
                                align: 'left',
                                style: {
                                    'fontSize': '14px',
                                    'font-family': 'Roboto, "Helvetica Neue", sans-serif'
                                },
                                y:38
                            });
                        }
                        $scope.loading = false;
                    });
                $http.get($rootScope.apiUrl + '/get_numbers_log')
                    .success(function (response) {
                        if (response['result']) {
                            $scope.panelResult[1].info = response['realtime'];
                            $scope.panelResult[2].info = response['day'];
                            $scope.panelResult[3].info = response['month'];
                        }
                    })
            };

            var stopGetData = $interval(function () {
                getData();
            }, 1000 * 60);
            setTimeout(function () {
                $scope.$apply(getData);
            }, 2000);

            var changeRoute = $rootScope.$on('$locationChangeSuccess', function () {
                // $interval.cancel(stopChart);
                $interval.cancel(stopGetData);
                $state.reload();
                changeRoute();
            });

            $scope.clickFilter = function (key, query) {
                searchQuery.setSearchQuery(key, query);
                $state.go("dashboard.logs");
            };
            

        }
    });