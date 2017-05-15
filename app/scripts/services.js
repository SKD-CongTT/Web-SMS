'use strict';

angular
    .module('webix')
    .factory('authInterceptor', authInterceptor)
    .factory('searchQuery', searchQuery)
    .factory('searchQueryAlert', searchQueryAlert)
    .service('user', userService)
    .service('auth', authService)
    .factory('profile', userProfile)
    .factory('$exceptionHandler', ['$log', function($log) {
        return function myExceptionHandler(exception, cause) {
            $log.warn(exception, cause);
        };
    }]);
function authService($localStorage,$location,$window) {
    var srvc = this;

    srvc.parseJwt = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    };

    srvc.saveToken = function (token) {
        $localStorage.jwtToken = token;
    };
    srvc.saveGroup = function (group) {
        $localStorage.group = group;
    };
    srvc.saveProfile = function (profile) {
        $localStorage.profile = profile;
    };

    srvc.logout = function () {
        delete $localStorage.profile;
        delete $localStorage.jwtToken;
        $window.location.reload();
        $location.path('/login');
    };

    srvc.deleteLocalStorage = function(){
        delete $localStorage.profile;
        delete $localStorage.jwtToken;
    };

    srvc.getToken = function () {
        return $localStorage.jwtToken;
    };
    srvc.getGroup = function (){
        return $localStorage.group;
    };
    srvc.getProfile = function () {
        return $localStorage.profile;
    };

    srvc.isAuthed = function () {
        var token = srvc.getToken();
        if (token) {
            var params = srvc.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };
}

function userService($http,$rootScope,$location,PermPermissionStore, $urlRouter, auth) {
    var srvc = this;
    srvc.login = function (username, password) {
        $rootScope.errorLogin = "";
        $rootScope.onLogin = true;
        return $http({
            method: 'POST',
            url: $rootScope.apiUrl +'/auth/token/obtain/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {
                username: username,
                password: password
            }
        }).then(function (response) {
            if (response.data.token){
                $location.path('/home');
            } else {
                $rootScope.errorLogin = "Username or Password is Incorrect";
            }
        }, function(response){
            $rootScope.errorLogin = "Username or Password is Incorrect";
        })
    };
}
function userProfile($http, $rootScope, auth) {
    return {
        getProfile : function (){
            if (auth.getGroup() == "lecturer"){
                $http.get($rootScope.apiUrl + '/lecturers/').then(function (response){
                    if(response.data.results !== false) {
                        return response;
                    } else {
                        $location.path('/login')
                    }
                })
            }
            else{
                $http.get($rootScope.apiUrl + '/students/').then(function (response){
                    if(response.data.results !== false) {
                        return response;
                    } else {
                        $location.path('/login')
                    }
                })
            }
        }
    }
}
function authInterceptor($rootScope, auth) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
            if(config.url.indexOf($rootScope.apiUrl) === 0 && token) {
                config.headers.Authorization ='JWT '+ token;
            }
            return config;
        },

        response: function(res) {
            if(res.config.url.indexOf($rootScope.apiUrl) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
                auth.saveGroup(res.data.group);
                auth.saveProfile(res.data.username);
            }
            return res;
        }
    }
}

function searchQuery() {
    var data = '';
    var stringParse = function (string) {
        string = string.split(")(");
        string = string.join(" | ");
        string = string.replace("(","");
        string = string.replace(")","");
        return string;
    };

    return {
        getSearchQuery: function () {
            return data;
        },

        setQuery: function (string) {
            data = string;
        },

        setSearchQuery : function (key, query) {
            var stringT = '(' + key +'=' + query + ')';
            data = stringParse(stringT);
        }
    }
}

function searchQueryAlert() {
    var data = '';

    return {
        getSearchQueryAlert: function () {
            return data;
        },

        setQueryAlert: function (string) {
            data = string;
        }
    }
}
