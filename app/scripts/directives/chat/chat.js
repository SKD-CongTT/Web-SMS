'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('webix')


    .directive('spLine', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });
                Highcharts.chart(element[0], {

                    chart: {
                        type: 'line',
                        zoomType: 'x',
                        animation: Highcharts.svg,
                        marginRight: 10,
                        events: {
                            load: function () {
                                var series = this.series[0];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.random();
                                    series.addPoint([x, y], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: scope.title
                    },
                    xAxis: {
                        type: 'datetime',
                        tickInterval:4000
                    },
                    yAxis: {
                        title:{
                            text: 'Value'
                        },
                        plotLines: [{
                            value:0,
                            width:1,
                            color:'#808080'
                        }]
                    },
                    tooltip:{
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        layout: 'vertical',
                        x: 0,
                        y: 0
                    },
                    exporting: {
                        enabled: true
                    },
                    series: [{
                        name: 'random data',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -20; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: Math.random()
                                });
                            }
                            return data;
                        }())
                    }]
                });
            }
        };
    })

