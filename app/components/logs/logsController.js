
angular.module('webix')
    .controller('logsController', function($scope,$rootScope,$http,auth,$interval,$state,$timeout,searchQuery,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            $scope.query = searchQuery.getSearchQuery();
            $scope.$watch('query', function (newValue, oldValue) {
                if (newValue !== oldValue) searchQuery.setQuery(newValue);
            });

            $scope.formSearch = {
                id: "undefined",
                vh: "undefined"
            };
            $scope.listIndexs = [];
            $scope.timeReload = 60000;
            $scope.timeOptions = [
                {value:30000,name:"30 giây reload"},
                {value:60000,name:"60 giây reload"},
                {value:300000,name:"5 phút reload"}
            ];
            $scope.logsPerPageOptions = [
                {value:20,name:"20 kết quả/trang"},
                {value:50,name:"50 kết quả/trang"},
                {value:100,name:"100 kết quả/trang"}
            ];
            $scope.chartData = [];
            $scope.loadingChart = true;

            $scope.requestDone = false;
            $scope.logs = [];
            $scope.aggregations = [];
            $scope.totalLogs = 0;
            $scope.logsPerPage = 20;

            var toastFail = $mdToast.simple()
                .textContent('Không có kết quả tìm kiếm !')
                .position('right bottom');

            Highcharts.setOptions({
                global: {
                    timezoneOffset: 0
                }
            });

            var getResultAdvancedSearch = function (pageNumber,range) {
                if (auth.isAuthed()){
                    $scope.range = range;
                    pageNumber=(pageNumber-1)*$scope.logsPerPage;
                    $scope.loadingChart = true;
                    if ($scope.query !== "") {
                        range = 4;
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl+'/advance_search/id/'+$scope.formSearch.id+'/virtual_host/'+$scope.formSearch.vh+'/from/'+pageNumber+'/size/'+$scope.logsPerPage+'/range/'+range,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                userquery: $scope.query
                            }
                        })
                            .success(function(response){
                                if (response.count == 0) {
                                    $mdToast.show(toastFail);
                                    $scope.loadingChart = false;
                                } else {
                                    $scope.logs = response['result'];
                                    $scope.totalLogs = response['count'];
                                    $scope.aggregations = response['aggregations'];
                                    $scope.loadingChart = false;
                                    $scope.chartData = [];
                                    if(response['chart'].length){
                                        $scope.chartData[0] = response['chart'][0];
                                        for (var i = 1; i < response['chart'].length; i++) {
                                            $scope.chartData.push(response['chart'][i]);
                                        }
                                        $scope.chartConfig = {
                                            options: {
                                                chart: {
                                                    type: 'column',
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
                                                        pointPadding: 0,
                                                        groupPadding: 0,
                                                        borderWidth: 0,
                                                        shadow: false
                                                    }
                                                },
                                                tooltip:{
                                                    formatter: function () {
                                                        return Highcharts.dateFormat('%d/%m/%Y %H:%M:%S', this.x) + "<br/>" +"<b>" +this.y + " sự kiện" + "</b>";
                                                    }
                                                },
                                                lang: {
                                                    btn0: "1 Giờ",
                                                    btn1: "1 Ngày",
                                                    btn2: "1 Tuần",
                                                    btn3: "1 Tháng",
                                                    btn4: "1 Năm"
                                                },
                                                exporting: {
                                                    buttons: {
                                                        customButton4: {
                                                            onclick: function () {
                                                                changeRangeChart(4);
                                                            },
                                                            x:0,
                                                            y:-5,
                                                            text:"1 Năm",
                                                            _titleKey:"btn4"
                                                        },
                                                        customButton3: {
                                                            onclick: function () {
                                                                changeRangeChart(3);
                                                            },
                                                            x:-70,
                                                            y:-5,
                                                            text: '1 Tháng',
                                                            _titleKey:"btn3"
                                                        },
                                                        customButton2: {
                                                            onclick: function () {
                                                                changeRangeChart(2);
                                                            },
                                                            x:-140,
                                                            y:-5,
                                                            text: '1 Tuần',
                                                            _titleKey:"btn2"
                                                        },
                                                        customButton1: {
                                                            onclick: function () {
                                                                changeRangeChart(1);
                                                            },
                                                            x:-210,
                                                            y:-5,
                                                            text: '1 Ngày',
                                                            _titleKey:"btn1"
                                                        },
                                                        customButton0: {
                                                            onclick: function () {
                                                                changeRangeChart(0);
                                                            },
                                                            x:-280,
                                                            y:-5,
                                                            text: '1 Giờ',
                                                            _titleKey:"btn0"
                                                        }
                                                    }
                                                }
                                            },
                                            xAxis: {
                                                type: 'datetime',
                                                minTickInterval : 1000*60
                                            },
                                            yAxis: {
                                                minTickInterval:20,
                                                title: {
                                                    text: 'Số lượng sự kiện'
                                                }
                                            },
                                            title: {
                                                text: 'Thống kê sự kiện',
                                                style: {
                                                    'fontSize': '14px'
                                                }
                                            },
                                            series: [{
                                                data: $scope.chartData,
                                                showInLegend: false,
                                                zones: [{
                                                    value: 0,
                                                    color: '#f7a35c'
                                                }, {
                                                    color: '#536DFE'
                                                }]
                                            }],
                                            size: {
                                                height: 200
                                            },
                                            func: function (chart) {
                                                if(chart){
                                                    //setup some logic for the chart
                                                    $timeout(function() {
                                                        chart.reflow();
                                                    }, 0);
                                                }
                                            }
                                        };
                                    } else {
                                        $scope.chartData = [];
                                        var chart = $('#realtimeChart').highcharts();
                                        chart.update({
                                            series: [{
                                                data: $scope.chartData
                                            }]
                                        });
                                    }
                                }
                            })
                            .error(function () {
                                $scope.totalLogs = 0;
                                $scope.aggregations = []
                                $scope.loadingChart = false;
                            })
                    } else {
                        $scope.loadingChart = true;
                        $http.get($rootScope.apiUrl+'/search_log/id/'+$scope.formSearch.id+'/virtual_host/'+$scope.formSearch.vh+'/from/'+pageNumber+'/size/'+$scope.logsPerPage+'/range/'+range)
                            .success(function(response){
                                if (response.count == 0) {
                                    $mdToast.show(toastFail);
                                    $scope.loadingChart = false;
                                } else {
                                    $scope.requestDone = true;
                                    $scope.logs = response['result'];
                                    $scope.totalLogs = response['count'];
                                    $scope.aggregations = response['aggregations'];
                                    $scope.loadingChart = false;
                                    $scope.chartData = [];
                                    if(response['chart']){
                                        $scope.chartData[0] = response['chart'][0];
                                        for (var i = 1; i < response['chart'].length; i++) {
                                            $scope.chartData.push(response['chart'][i]);
                                        }
                                        $scope.chartConfig = {
                                            options: {
                                                chart: {
                                                    type: 'column',
                                                    zoomType: 'x',
                                                    borderColor: "#e5e6e9",
                                                    borderWidth: 2
                                                },
                                                credits: false,
                                                plotOptions: {
                                                    "series": {
                                                        "stacking": "normal",
                                                        animation: false,
                                                        turboThreshold : 0,
                                                        pointPadding: 0,
                                                        groupPadding: 0,
                                                        borderWidth: 1,
                                                        shadow: false
                                                    }
                                                },
                                                tooltip:{
                                                    formatter: function () {
                                                        return Highcharts.dateFormat('%d/%m/%Y %H:%M:%S', this.x) + "<br/>" +"<b>" +this.y + " sự kiện" + "</b>";
                                                    }
                                                },
                                                lang: {
                                                    btn0: "1 Giờ",
                                                    btn1: "1 Ngày",
                                                    btn2: "1 Tuần",
                                                    btn3: "1 Tháng",
                                                    btn4: "1 Năm"
                                                },
                                                exporting: {
                                                    buttons: {
                                                        customButton4: {
                                                            onclick: function () {
                                                                changeRangeChart(4);
                                                            },
                                                            x:0,
                                                            y:-5,
                                                            text:"1 Năm",
                                                            _titleKey:"btn4"
                                                        },
                                                        customButton3: {
                                                            onclick: function () {
                                                                changeRangeChart(3);
                                                            },
                                                            x:-70,
                                                            y:-5,
                                                            text: '1 Tháng',
                                                            _titleKey:"btn3"
                                                        },
                                                        customButton2: {
                                                            onclick: function () {
                                                                changeRangeChart(2);
                                                            },
                                                            x:-140,
                                                            y:-5,
                                                            text: '1 Tuần',
                                                            _titleKey:"btn2"
                                                        },
                                                        customButton1: {
                                                            onclick: function () {
                                                                changeRangeChart(1);
                                                            },
                                                            x:-210,
                                                            y:-5,
                                                            text: '1 Ngày',
                                                            _titleKey:"btn1"
                                                        },
                                                        customButton0: {
                                                            onclick: function () {
                                                                changeRangeChart(0);
                                                            },
                                                            x:-280,
                                                            y:-5,
                                                            text: '1 Giờ',
                                                            _titleKey:"btn0"
                                                        }
                                                    }
                                                }
                                            },
                                            xAxis: {
                                                type: 'datetime',
                                                minTickInterval : 1000*60*5
                                            },
                                            yAxis: {
                                                minTickInterval:20,
                                                title: {
                                                    text: 'Số lượng sự kiện'
                                                }
                                            },
                                            title: {
                                                text: 'Thống kê sự kiện',
                                                style: {
                                                    'fontSize': '14px'
                                                }
                                            },
                                            series: [{
                                                data: $scope.chartData,
                                                showInLegend: false,
                                                zones: [{
                                                    value: 0,
                                                    color: '#f7a35c'
                                                }, {
                                                    color: '#536DFE'
                                                }]
                                            }],
                                            size: {
                                                height: 150
                                            },
                                            func: function (chart) {
                                                if(chart){
                                                    //setup some logic for the chart
                                                    $timeout(function() {
                                                        chart.reflow();
                                                    }, 0);
                                                }
                                            }
                                        };
                                    } else {
                                        $scope.chartData = [];
                                        var chart = $('#realtimeChart').highcharts();
                                        chart.update({
                                            series: [{
                                                data: $scope.chartData
                                            }]
                                        })
                                    }
                                }
                            })
                            .error(function () {
                                $scope.loadingChart = false;
                                $scope.chartData = [];
                            })
                    }
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };
            
            /*Basic search function*/

            $http.get($rootScope.apiUrl+'/get_index').
                success(function(response) {
                $scope.listIndexs = response;
            });

            $scope.$watch('formSearch.id', function(id){
                $scope.formSearch.vh = "undefined";
                // delete $scope.query;
                angular.forEach($scope.listIndexs, function(listIndex){
                    if(listIndex.id === id){
                        $scope.selectedId = listIndex;
                    }
                });
            });

            $scope.$watch('logsPerPage', function(number){
                $scope.logsPerPage = number;
            });

            $scope.pagination = {
                current: 1
            };

            $scope.range = 0;

            $scope.changeRange = function (num) {
                $scope.loadingChart = true;
                $scope.range = num;
                getResultAdvancedSearch($scope.pagination.current, $scope.range);
            };
            
            var changeRangeChart = function (num) {
                $scope.loadingChart = true;
                $scope.range = num;
                getResultAdvancedSearch($scope.pagination.current, $scope.range);
            };

            var dereg = $rootScope.$on('$locationChangeSuccess', function() {
                $interval.cancel(stop);
                $state.reload();
                dereg();
            });

            getResultAdvancedSearch(1,0);

            var stop = $interval(function () {
                getResultAdvancedSearch($scope.pagination.current, $scope.range);
            },$scope.timeReload);

            $scope.$watch('range', function(num){
                $interval.cancel(stop);
                stop = $interval(function () {
                    getResultAdvancedSearch($scope.pagination.current,num);
                },$scope.timeReload);
            });

            $scope.$watch('timeReload', function(time){
                $interval.cancel(stop);
                stop = $interval(function () {
                    getResultAdvancedSearch($scope.pagination.current, $scope.range);
                },time);
            });

            $scope.pageChanged = function(newPage){
                if (auth.isAuthed()){
                    getResultAdvancedSearch(newPage, $scope.range);
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.onSubmitId = function () {
                if(auth.isAuthed()) {
                    $scope.loadingChart = true;
                    $scope.pagination = {
                        current: 1
                    };
                    delete $scope.formSearch.vh;
                    $interval.cancel(stop);
                    stop = $interval(function () {
                        getResultAdvancedSearch($scope.pagination.current, $scope.range);
                    },$scope.timeReload);

                    getResultAdvancedSearch(1,0);
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            $scope.onSubmitVh = function () {
                if(auth.isAuthed()) {
                    $scope.loadingChart = true;
                    $scope.pagination = {
                        current: 1
                    };
                    $interval.cancel(stop);
                    stop = $interval(function () {
                        getResultAdvancedSearch($scope.pagination.current, $scope.range);
                    },$scope.timeReload);
                    getResultAdvancedSearch(1,0);
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };


            /*Advanced search function*/

            $scope.stm = {};
            $scope.searchOptionBtn = function () {
                if(auth.isAuthed()) {
                    $('#searchModal').modal('show');
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };


            $scope.search = function () {
                $scope.loadingChart = true;
                $scope.pagination = {
                    current: 1
                };
                $scope.chartData = [];
                if ($scope.query !== "") {
                    $http({
                        method: 'POST',
                        url: $rootScope.apiUrl+'/save_history_search',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            userquery: $scope.query
                        }
                    }).success(function () {
                        get_history_search();
                    })
                }

                getResultAdvancedSearch($scope.pagination.current, 4);
            };

            $scope.accept = function () {
                $scope.query = "";
                if (!$scope.checked) {
                    var dayStartDate =  $scope.datePicker.startDate._d.getDate();
                    var monthStartDate = $scope.datePicker.startDate._d.getMonth()+1;
                    var yearStartDate = $scope.datePicker.startDate._d.getFullYear();
                    var dayEndDate =  $scope.datePicker.endDate._d.getDate();
                    var monthEndDate = $scope.datePicker.endDate._d.getMonth()+1;
                    var yearEndDate = $scope.datePicker.endDate._d.getFullYear();
                    var hourFromPicker = $scope.timeFrom.getHours();
                    var minuteFromPicker = $scope.timeFrom.getMinutes();
                    var hourToPicker = $scope.timeTo.getHours();
                    var minuteToPicker = $scope.timeTo.getMinutes();

                    $scope.query = $scope.query.concat('(time=',yearStartDate,'-',monthStartDate,'-',dayStartDate,'T',hourFromPicker,':',minuteFromPicker,':00 ','to ',yearEndDate,'-',monthEndDate,'-',dayEndDate,'T',hourToPicker,':',minuteToPicker,':00)');
                }
                if ($scope.stm.browser) {
                    $scope.query = $scope.query.concat('(browser=', $scope.stm.browser, ')');
                }
                if ($scope.stm.byte_tx) {
                    $scope.query = $scope.query.concat('(byte=', $scope.stm.byte_tx, ')');
                }
                if ($scope.stm.url) {
                    $scope.query = $scope.query.concat('(url=', $scope.stm.url, ')');
                }
                if ($scope.stm.referer) {
                    $scope.query = $scope.query.concat('(referer=', $scope.stm.referer, ')');
                }
                if ($scope.stm.country) {
                    $scope.query = $scope.query.concat('(country=', $scope.stm.country, ')');
                }
                if ($scope.stm.country_code) {
                    $scope.query = $scope.query.concat('(country_code=', $scope.stm.country_code, ')');
                }
                if ($scope.stm.client_ip) {
                    $scope.query = $scope.query.concat('(client_ip=', $scope.stm.client_ip, ')');
                }
                if ($scope.stm.method) {
                    $scope.query = $scope.query.concat('(method=', $scope.stm.method, ')');
                }
                if ($scope.stm.path) {
                    $scope.query = $scope.query.concat('(path=', $scope.stm.path, ')');
                }
                if ($scope.stm.request_query) {
                    $scope.query = $scope.query.concat('(request_query=', $scope.stm.request_query, ')');
                }
                if ($scope.stm.http_version) {
                    $scope.query = $scope.query.concat('(http_version=', $scope.stm.http_version, ')');
                }
                if ($scope.stm.status) {
                    $scope.query = $scope.query.concat('(status=', $scope.stm.status, ')');
                }
                if ($scope.stm.remote_user) {
                    $scope.query = $scope.query.concat('(user=', $scope.stm.remote_user, ')');
                }

                $scope.query= $scope.query.split(")(");
                $scope.query= $scope.query.join(" | ");
                $scope.query= $scope.query.replace("(","");
                $scope.query= $scope.query.replace(")","");

                $('#searchModal').modal('hide');

                $scope.pagination = {
                    current: 1
                };
                getResultAdvancedSearch(1,0);
            };

            var stringParse = function (string) {
                string= string.split(")(");
                string= string.join(" | ");
                string= string.replace("(","");
                string= string.replace(")","");
                return string;
            };

            $scope.clickFilter = function (key, query) {

                var stringT = '(' + key +'=' + query + ')';
                if($scope.query != ''){
                    $scope.query =  $scope.query + ' | ' + stringParse(stringT);
                } else {
                    $scope.query = stringParse(stringT);
                }

                $scope.requestDone = false;

                $timeout(function() {
                    angular.element(document.getElementById('closeBtn')).trigger('click');
                });
                $timeout(function() {
                    angular.element(document.getElementById('searchBtn')).trigger('click');
                },1000);
                // getResultAdvancedSearch(1,4);
                // console.log($scope.query);
            };


            /*Setting date-timepicker*/


            $scope.datePicker = {
                startDate: moment().subtract(1, "days"),
                endDate: moment()
            };

            $scope.currentDay = moment();

            $scope.opts = {
                locale: {format: 'DD/MM/YYYY'},
                ranges: {
                    '1 ngày trước': [moment().subtract(1, 'days'), moment()],
                    '7 ngày trước': [moment().subtract(6, 'days'), moment()],
                    '30 ngày trước': [moment().subtract(29, 'days'), moment()]
                }
            };
            $scope.timeFrom = new Date();
            $scope.timeTo = new Date()

            /*Create Alert function*/
            $scope.createAlertModal = function () {
                if(auth.isAuthed()) {
                    $mdDialog.show({
                        locals: {
                            serchQuery: $scope.query,
                            index_id: $scope.formSearch.id,
                            type: $scope.formSearch.vh
                        },
                        controller: DialogAddController,
                        templateUrl: 'components/logs/addAlertTemplate.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true
                    })
                } else {
                    alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
                    auth.logout();
                }
            };

            function DialogAddController($scope, $mdDialog, $mdToast, serchQuery, index_id, type) {

                $scope.alertModal = {
                    name: '',
                    severity: 'medium',
                    rule_raw: serchQuery,
                    tag_description: ''
                };

                var toastSuccess = $mdToast.simple()
                    .textContent('Thêm Cảnh báo thành công')
                    .position('right bottom');

                var toastFail = $mdToast.simple()
                    .textContent('Thêm Cảnh báo thất bại')
                    .position('right bottom');


                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.onRequest = true;

                $scope.add = function () {
                    if(auth.isAuthed()) {
                        $http({
                            method: 'POST',
                            url: $rootScope.apiUrl+"/create_alert",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                name: $scope.alertModal.name,
                                severity: $scope.alertModal.severity,
                                rule_query: $scope.alertModal.query,
                                tag_description: $scope.alertModal.tag_description,
                                _index_id: index_id,
                                _type: type
                            }
                        }).success(function (response) {
                            $mdDialog.hide();
                            if (response['result']) {
                                $mdToast.show(toastSuccess);
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
                }
            }

            /*Search autocomplete*/

            var get_history_search = function () {
                $http.get($rootScope.apiUrl+'/get_history_search')
                    .then(function(respone) {
                        $scope.historySearch = respone.data;
                    });
            };
            get_history_search();

            $scope.removeSearch = function(id) {

                $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + '/delete_history_search',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        _id: id
                    }
                }).success(function () {
                    get_history_search();
                });
                $timeout(function () {
                    $scope.query = "";
                },100)

            };

        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });