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
        'textAngular',
        'ui.codemirror',
        'ngTable'
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

            $httpProvider.interceptors.push('authInterceptor');
            $urlRouterProvider.deferIntercept();
            $ocLazyLoadProvider.config({
                debug:false,
                events:true
            });
            $urlRouterProvider.when('/management', '/management/list_student');
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('dashboard', {
                    url: '',
                    templateUrl: 'components/dashboard/dashboardView.html',
                    controller: 'dashboardController',
                    data: {
                        permissions: {
                            only: ['1','2','3'],
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
                .state('dashboard.student_management',{
                    templateUrl:'components/management/managementView.html',
                    title: 'Student Management',
                    url:'/management',
                    data: {
                        permissions: {
                            only: ['1','2', '3'],
                            redirectTo: 'dashboard.profile'
                        }
                    }
                })
                .state('dashboard.student_management.list_student',{
                    url: '/list_student',
                    title: 'List Student.',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/management/listStudent/listStudentController.js'
                                ]
                            })
                        }
                    },
                    data: {
                        permissions: {
                            only: ['1', '3'],
                            redirectTo: 'dashboard.student_management.student_result'
                        }
                    },
                    views: {
                        'positive': {
                            templateUrl:'components/management/listStudent/listStudentView.html',
                            controller: 'listStudentController'
                        }
                    }
                })
                .state('dashboard.student_management.update_by_session',{
                    url: '/update_by_session',
                    title: 'Update By Session.',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/management/updateBySession/updateBySessionController.js'
                                ]
                            })
                        }
                    },
                    data: {
                        permissions: {
                            only: ['1'],
                            redirectTo: 'dashboard.student_management.student_result'
                        }
                    },
                    views: {
                        'report': {
                            templateUrl:'components/management/updateBySession/updateBySessionView.html',
                            controller: 'updateBySessionController'
                        }
                    }
                })
                .state('dashboard.student_management.student_result',{
                    url: '/student_result',
                    title: 'Student Result',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/management/studentResult/studentResultController.js'
                                ]
                            })
                        }
                    },
                    data: {
                        permissions: {
                            only: ['1','2','3'],
                            redirectTo: 'dashboard.profile'
                        }
                    },
                    views: {
                        'negative': {
                            templateUrl:'components/management/studentResult/studentResultView.html',
                            controller: 'studentResultController'
                        }
                    }
                })
                .state('dashboard.student_management.schedule',{
                    url: '/schedule',
                    title: 'Schedule',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'webix',
                                files:[
                                    'components/management/schedule/scheduleController.js'
                                ]
                            })
                        }
                    },
                    data: {
                        permissions: {
                            only: ['1','2'],
                            redirectTo: 'dashboard.profile'
                        }
                    },
                    views: {
                        'done': {
                            templateUrl:'components/management/schedule/scheduleView.html',
                            controller: 'scheduleController'
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
                            only: ['1', '2', '3'],
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
        $rootScope.downloadUrl = 'http://192.168.1.66';
        $rootScope.webUrl = 'http://ictk59-api.herokuapp.com';
        $rootScope.webUrlHttp = 'http://ictk59-api.herokuapp.com';
        $rootScope.selectedStudent = 0;
        $rootScope.showCourse = [];
        $rootScope.classes = [];
        $rootScope.sessions = [];
        $rootScope.filtedStudents = [];
        $rootScope.loading = true;
        $rootScope.tableByClass = false;
        $rootScope.tableBySession = false;
        var permissions = [];
        $rootScope.period = {
            1 : {
                'period' : 1,
                'start_at':'6h45',
                'end_at' : '7h30'
            },
            2 : {
                'period' : 2,
                'start_at':'7h35',
                'end_at' : '8h20'
            },
            3 : {
                'period' : 3,
                'start_at':'8h30',
                'end_at' : '9h15'
            },
            4 : {
                'period' : 4,
                'start_at':'9h20',
                'end_at' : '10h05'
            },
            5 : {
                'period' : 5,
                'start_at':'10h15',
                'end_at' : '11h00'
            },
            6 : {
                'period' : 6,
                'start_at':'11h05',
                'end_at' : '11h50'
            },
            7 : {
                'period' : 7,
                'start_at':'12h30',
                'end_at' : '13h15'
            },
            8 : {
                'period' : 8,
                'start_at':'13h20',
                'end_at' : '14h05'
            },
            9 : {
                'period' : 9,
                'start_at':'14h15',
                'end_at' : '15h00'
            },
            10 : {
                'period' : 10,
                'start_at':'15h05',
                'end_at' : '15h50'
            },
            11 : {
                'period' : 11,
                'start_at':'16h00',
                'end_at' : '16h45'
            },
            12 : {
                'period' : 12,
                'start_at':'16h50',
                'end_at' : '17h35'
            }
        };
        $rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState) {
            $rootScope.loading = true;
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
                    $rootScope.loading = false;
                }
                catch (e){
                    $http.get($rootScope.apiUrl + '/users/').then(function (response){
                        if(response.data.results !== false) {
                            $rootScope.profile = response.data;
                            $rootScope.loading = false;
                            $rootScope.profile.Name = response.data.last_name + " " + response.data.first_name;
                            $rootScope.profile.date_joined = $rootScope.profile.date_joined.replace("T", " ");
                            $rootScope.profile.date_joined = $rootScope.profile.date_joined.replace("Z", " ");
                            // $rootScope.profile.last_login = $rootScope.profile.last_login.replace("T", " ");
                            // $rootScope.profile.last_login = $rootScope.profile.last_login.replace("Z", " ");
                            var role = auth.getGroup();
                            if (role === "lecturer"){
                                $rootScope.profile.type = "LECTURER";
                            }
                            else if (role === "admin"){
                                $rootScope.profile.type = "ADMIN";
                            }
                            else{
                                $rootScope.profile.type = "STUDENT";
                                $rootScope.selectedStudent = $rootScope.profile;
                            }
                            $rootScope.profile.notExist = false;
                            $rootScope.days = [
                                {
                                    name: 'Monday',
                                    slots: [

                                    ]
                                },{
                                    name: 'Tuesday',
                                    slots: [

                                    ]
                                },{
                                    name: 'Wednesday',
                                    slots: [

                                    ]
                                },{
                                    name: 'Thursday',
                                    slots: [

                                    ]
                                },{
                                    name: 'Friday',
                                    slots: [

                                    ]
                                },
                                {
                                    name: 'Saturday',
                                    slots: [

                                    ]
                                }
                            ];
                            for (var i = 0; i < $rootScope.profile.sessions.length; i++){
                                var time = $rootScope.period[$rootScope.profile.sessions[i].start_at].start_at + " - " + $rootScope.period[$rootScope.profile.sessions[i].end_at].end_at;
                                var temp = {
                                    'time' : time,
                                    'name' : $rootScope.profile.sessions[i].course_id,
                                    'room' : $rootScope.profile.sessions[i].room_name,
                                    'class': $rootScope.profile.sessions[i].name
                                };
                                $rootScope.days[$rootScope.profile.sessions[i].week_day - 2].slots.push(temp);
                            }
                        } else {
                            $location.path('/login');
                        }
                    });
                    var role = auth.getGroup();
                    if (role === "lecturer"){
                        permissions = ['1'];
                    }
                    else if (role === "admin"){
                        permissions = ['3'];
                    }
                    else{
                        permissions = ['2'];
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



