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
        $scope.profileName;
         if (auth.getGroup() == "lecturer"){
            $http.get($rootScope.apiUrl + '/lecturers/').then(function (response){
                 if(response.data.results !== false) {
                            $scope.profileName = response.data.results[0].last_name + " " + response.data.results[0].first_name;
                        } else {
                            $location.path('/login')
                }
            })
        }
        else{
            $http.get($rootScope.apiUrl + '/students/').then(function (response){
                 if(response.data.results !== false) {
                            $scope.profileName = response.data.results[0].last_name + " " + response.data.results[0].first_name;
                        } else {
                            $location.path('/login')
                }
            })
        }
    });
