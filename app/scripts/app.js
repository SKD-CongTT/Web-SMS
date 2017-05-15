'use strict';
/**
 * @ngdoc overview
 * @name webix
 * @description
 * # webix
 *
 * Main module of the application.
 */
angular
    .module('webix', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angularUtils.directives.dirPagination',
        'highcharts-ng',
        'ngStorage',
        'ngAnimate',
        'ngSanitize',
        'permission',
        'permission.ui',
        'ngclipboard',
        'angular-web-notification',
        'mgcrea.ngStrap',
        'checklist-model',
        'ngMaterial',
        'ngMessages',
        'mdDataTable',
        'angular-toArrayFilter',
        'smDateTimeRangePicker',
        'textAngular','ui.codemirror'
    ])

    .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','$httpProvider','$mdThemingProvider','pickerProvider',
        function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider,$httpProvider,$mdThemingProvider,pickerProvider) {
            $mdThemingProvider.theme('input', 'default')
                .primaryPalette('grey');

            $mdThemingProvider
                .theme('dark-blue')
                .backgroundPalette('blue',{
                    'default': '500'
                }).dark();

            $mdThemingProvider
                .theme('default')
                .primaryPalette('blue', {
                    'default': '500'
                })
                .accentPalette('red', {
                    'default': '500'
                })
                .warnPalette('defaultPrimary');

            $mdThemingProvider.theme('dark', 'default')
                .primaryPalette('defaultPrimary')
                .dark();

            $mdThemingProvider.theme('custom', 'default')
                .primaryPalette('defaultPrimary', {
                    'hue-1': '50'
                });

            $mdThemingProvider.definePalette('defaultPrimary', {
                '50':  '#FFFFFF',
                '100': 'rgb(255, 198, 197)',
                '200': '#E75753',
                '300': '#E75753',
                '400': '#E75753',
                '500': '#E75753',
                '600': '#E75753',
                '700': '#E75753',
                '800': '#E75753',
                '900': '#E75753',
                'A100': '#E75753',
                'A200': '#E75753',
                'A400': '#E75753',
                'A700': '#E75753'
            });

            /*config daterange-picker*/
            pickerProvider.setOkLabel('Chọn');
            pickerProvider.setCancelLabel('Đóng');
            pickerProvider.setDayHeader('single'); //Options 'single','shortName', 'fullName'
            pickerProvider.setDaysNames([
                {'single':'CN','shortName':'CN','fullName':'Chủ nhật'},
                {'single':'T2','shortName':'Th 2','fullName':'Thứ 2'},
                {'single':'T3','shortName':'Th 3','fullName':'Thứ 3'},
                {'single':'T4','shortName':'Th 4','fullName':'Thứ 4'},
                {'single':'T5','shortName':'Th 5','fullName':'Thứ 5'},
                {'single':'T6','shortName':'Th 6','fullName':'Thứ 6'},
                {'single':'T7','shortName':'Th 7','fullName':'Thứ 7'}
            ]);
            pickerProvider.setMonthNames(["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]);
            pickerProvider.setRangeDefaultList([
                {
                    label:'Hôm nay',
                    startDate:moment().startOf('day'),
                    endDate:moment().endOf('day')
                },
                {
                    label:'1 Tuần trước',
                    startDate: moment().subtract(7,'d'),
                    endDate:moment()
                },
                {
                    label:'Tháng hiện tại',
                    startDate:moment().startOf('month'),
                    endDate: moment().endOf('month')
                },
                {
                    label:'1 Tháng trước',
                    startDate:moment().subtract(1,'month'),
                    endDate: moment()
                },
                {
                    label:'2 Tháng trước',
                    startDate:moment().subtract(2,'month'),
                    endDate: moment()
                },
                {
                    label: 'Quý hiện tại',
                    startDate: moment().startOf('quarter'),
                    endDate: moment().endOf('quarter')
                }
            ]);
            pickerProvider.setRangeCustomStartEnd(['Ngày bắt đầu', 'Ngày kết thúc']);


            $httpProvider.interceptors.push('authInterceptor');
            $urlRouterProvider.deferIntercept();
            $ocLazyLoadProvider.config({
                debug:false,
                events:true
            });

            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('dashboard', {
                    url: '',
                    templateUrl: 'components/dashboard/dashboardView.html',
                    controller: 'dashboardController',
                    data: {
                        permissions: {
                            only: ['1','2'],
                            redirectTo: 'dashboard.profile'
                        }
                    },
                    abstract: true ,
                    resolve: {
                        loadMyDirectives:function($ocLazyLoad){
                            return $ocLazyLoad.load(
                                {
                                    name:'webix',
                                    files:[
                                        'components/dashboard/dashboardController.js'
                                    ]
                                })
                        }
                    }
                })
                .state('dashboard.home',{
                    url: '/home',
                    // title: 'WebAssistant - Hệ thống theo dõi hoạt động và phát hiện bất thường cho website.',
                    // data: {
                    //     permissions: {
                    //         only: '9',
                    //         redirectTo: 'dashboard.profile'
                    //     }
                    // },
                    // resolve: {
                    //     loadMyFiles:function($ocLazyLoad) {
                    //         return $ocLazyLoad.load({
                    //             name:'webix',
                    //             files:[
                    //                 'scripts/directives/dashboard/stats/stats.js'
                    //             ]
                    //         })
                    //     }
                    // },
                    templateUrl:'components/home/homeView.html',
                    controller: 'generalController',

                    title: 'Student Management System',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/home/homeView.js'
                                ]
                            })
                        }
                    },

                })
                // .state('dashboard.home.general',{
                //     url: '/general',
                //     title: 'Student Management System',
                //     resolve: {
                //         loadMyFiles:function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 name:'webix',
                //                 files:[
                //                     'components/home/general/generalController.js'
                //                 ]
                //             })
                //         }
                //     },
                //     views: {
                //         'general': {
                //             templateUrl:'components/home/general/generalView.html',
                //             controller: 'generalController'
                //         }
                //     }
                // })
                // .state('dashboard.home.system',{
                //     url: '/system',
                //     title: 'WebAssistant - Hệ thống theo dõi hoạt động và phát hiện bất thường cho website.',
                //     resolve: {
                //         loadMyFiles:function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 name:'webix',
                //                 files:[
                //                     'components/home/system/systemController.js'
                //                 ]
                //             })
                //         }
                //     },
                //     views: {
                //         'system': {
                //             templateUrl:'components/home/system/systemView.html',
                //             controller: 'systemController'
                //         }
                //     }
                // })
                // .state('dashboard.home.security',{
                //     url: '/security',
                //     title: 'WebAssistant - Hệ thống theo dõi hoạt động và phát hiện bất thường cho website.',
                //     resolve: {
                //         loadMyFiles:function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 name:'webix',
                //                 files:[
                //                     'components/home/security/securityController.js'
                //                 ]
                //             })
                //         }
                //     },
                //     views: {
                //         'security': {
                //             templateUrl:'components/home/security/securityView.html',
                //             controller: 'securityController'
                //         }
                //     }
                // })
                // .state('dashboard.home.logs-centralize',{
                //     url: '/logs-centralize',
                //     title: 'WebAssistant - Hệ thống theo dõi hoạt động và phát hiện bất thường cho website.',
                //     resolve: {
                //         loadMyFiles:function($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 name:'webix',
                //                 files:[
                //                     'components/home/logs/logsCentralizeController.js',
                //                     'bower_components/highMap/map.js',
                //                     'bower_components/highMap/world.js'
                //                 ]
                //             })
                //         }
                //     },
                //     views: {
                //         'logs-centralize': {
                //             templateUrl:'components/home/logs/logsCentralizeView.html',
                //             controller: 'logsCentralizeController'
                //         }
                //     }
                // })


                .state('dashboard.student_management',{
                    templateUrl:'components/alerts/alertsView.html',
                    title: 'Student Management',
                    url:'/student_management',
                    data: {
                        permissions: {
                            only: '1',
                            redirectTo: 'dashboard.profile'
                        }
                    }
                })

                .state('dashboard.course_registration',{
                    templateUrl:'components/register/registerView.html',
                    title: 'Course Registration',
                    url:'/course_registration',
                    controller:'registerController',
                    data: {
                        permissions: {
                            only: '2',
                            redirectTo: 'dashboard.profile'
                        }
                    },
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/register/registerController.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.course_information',{
                    templateUrl:'components/course/courseView.html',
                    title: 'Course Information',
                    url:'/course_information',
                    controller:'courseController',
                    data: {
                        permissions: {
                            only: ['1', '2'],
                            redirectTo: 'dashboard.profile'
                        }
                    },
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/course/courseController.js',

                                ]
                            })
                        }
                    }
                })

                .state('dashboard.profile',{
                    templateUrl:'components/profile/profileView.html',
                    title: 'Profile',
                    url:'/profile',
                    controller:'profileController',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/profile/profileController.js'
                                ]
                            })
                        }
                    }
                })

                .state('authen', {
                    url:'',
                    templateUrl: 'components/authen/authenView.html',
                    abstract: true
                })

                .state('authen.login',{
                    title: 'Sign in - Student Management System',
                    url:'/login',
                    bodyClass: 'login-background',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/authen/login/loginController.js'
                                ]
                            })
                        }
                    },
                    views: {
                        'login': {
                            templateUrl:'components/authen/login/loginView.html',
                            controller:'loginController'
                        }
                    }
                })

                .state('authen.forgot',{
                    title: 'Forgot password - Student Management System',
                    url:'/forgot',
                    bodyClass: 'login-background',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/authen/forgot/forgotController.js'
                                ]
                            })
                        }
                    },
                    views: {
                        'forgot': {
                            templateUrl:'components/authen/forgot/forgotView.html',
                            controller:'forgotController'
                        }
                    }
                })

                .state('logout',{
                    title: 'Sign out - Student Management System',
                    url:'/logout',
                    controller:'logoutController',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/logout/logoutController.js'
                                ]
                            })
                        }
                    }
                })
        }])

    .run(function ($anchorScroll, $rootScope, $localStorage, $location, auth, $window, $urlRouter, $http, PermPermissionStore, $state, $timeout)
    {
        $rootScope.$state = $state;
        $rootScope.wrongInfo = false;
        $rootScope.onLogin = false;
        $rootScope.apiUrl = 'http://ictk59-api.herokuapp.com';
        $rootScope.downloadUrl = 'http://ictk59-api.herokuapp.com';
        $rootScope.webUrl = 'http://ictk59-api.herokuapp.com';
        $rootScope.webUrlHttp = 'http://ictk59-api.herokuapp.com';
        $rootScope.showCourse = [];
        var permissions = []
        $rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState) {
            $rootScope.stateIsLoading = {value : true};
            $timeout(function () {
                $rootScope.stateIsLoading.value = false;
            }, 1000);

            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;

            var forgotPage = publicPages.indexOf($location.path()) === 1;
            var signupPage = publicPages.indexOf($location.path()) === 2;
            var reConfirmEmailPage = publicPages.indexOf($location.path()) === 3;

            if (!auth.isAuthed()) {
                $location.path('/login');
                $urlRouter.sync();
            } else {
                $rootScope.profile;
                try {
                    $rootScope.profile.notExist;
                }
                catch (e){
                    if (auth.getGroup() == "lecturer"){
                        permissions = ['1', '2'];
                        $http.get($rootScope.apiUrl + '/lecturers/').then(function (response){
                            if(response.data.results !== false) {
                                $rootScope.profile = response.data.results[0];
                                $rootScope.profile.Name = response.data.results[0].last_name + " " + response.data.results[0].first_name;
                                $rootScope.profile.type = "LECTURER";
                                $rootScope.profile.notExist = false;
                            } else {
                                $location.path('/login');
                            }
                        })
                    }
                    else{
                        permissions = ['2'];
                        $http.get($rootScope.apiUrl + '/students/').then(function (response){
                            if(response.data.results !== false) {
                                $rootScope.profile = response.data.results[0];
                                $rootScope.profile.Name = response.data.results[0].last_name + " " + response.data.results[0].first_name;
                                $rootScope.profile.type = "STUDENT";
                                $rootScope.profile.notExist = false;
                            } else {
                                $location.path('/login');
                            }
                        })
                    }
                }
                PermPermissionStore
                    .defineManyPermissions(permissions, function (permissionName) {
                        return _.contains(permissions, permissionName);
                    });
                $urlRouter.sync();
                $urlRouter.listen();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
            $rootScope.bodyClass = toState.bodyClass;
            $window.document.title = toState.title;
            $rootScope.currentNavItem = toState.name;
        });
    })

    .filter('myTimeFormat', function(){
        return function(x) {
            if(x) {
                var str = x.replace("T"," ");
                return str;
            }
            return "";
        };
    })
    .filter('myHostNameFormat', function(){
        return function(y) {
            var str1 = y.replace("-",":");
            return str1;
        };
    })
    .filter('longStringFormat', function(){
        return function(y) {
            var str1 = y.replace("-",":");
            return str1;
        };
    });



