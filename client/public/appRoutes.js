angular.module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state({
        name: 'client',
        url: '/',
        templateUrl: 'public/components/client/templates/client.template',
        controller: 'MainController'
    });

    $urlRouterProvider.otherwise('/');
}]);
