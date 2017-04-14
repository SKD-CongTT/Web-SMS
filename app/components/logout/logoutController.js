angular.module('webix')

    .controller('logoutController',function ($localStorage, $window,PermPermissionStore) {
        delete $localStorage.profile;
        delete $localStorage.jwtToken;
        PermPermissionStore.clearStore();
        $window.location.reload();
    });
