'use strict';
/**
 * @ngdoc function
 * @name webix.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webix
 */
angular.module('webix')
    .controller('dashboardController', function($scope,$mdMedia,$mdSidenav, $http, auth, $rootScope) {
        $scope.menuItems = [
            {
                name: 'Trang chủ',
                icon: 'home',
                sref: 'dashboard.home',
                permission: ['1', '2']
            },
            {
                name: 'Dang Ky Mon Hoc',
                icon: 'public',
                sref: 'dashboard.course_registration',
                permission:['1', '2']
            },
            {
                name: 'Thong Tin Khoa Hoc',
                icon: 'search',
                sref: 'dashboard.course_infomation',
                permission:['1', '2']
            },
            {
                name: 'Thong Tin Ca Nhan',
                icon: 'search',
                sref: 'dashboard.profile',
                permission:['1', '2']
            },
            {
                name: 'Them Diem',
                icon: 'search',
                sref : 'dashboard.score',
                permission: ['1', '2']
            }
        ];
        $scope.toggleLeftSidebar = function () {
            $mdSidenav('left').toggle();
        }
    });
